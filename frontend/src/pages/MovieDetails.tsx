import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Clock, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieDTO, WatchListStatus, WatchListDTO, WatchListCreateDTO } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";
import { movieService } from "@/services/movieService";
import { watchlistService } from "@/services/watchlistService";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function getImageUrl(path?: string) {
  if (!path) return "";
  return path.startsWith('http') ? path : `${TMDB_IMAGE_BASE}${path}`;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Busca detalhes do filme
  const { data: movie, isLoading, error } = useQuery<MovieDTO>({
    queryKey: ["movie", id],
    queryFn: () => movieService.getMovieById(movieId),
    enabled: !!id,
  });

  // Busca a watchlist do usuário
  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery<WatchListDTO[]>({
    queryKey: ["watchlist"],
    queryFn: watchlistService.getUserWatchlist,
    staleTime: 5 * 60 * 1000,
  });

  // Encontra o item da watchlist para este filme
  const watchlistItem = watchlist.find((item) => item.movie_id === movieId);

  // Estados locais para edição
  const [status, setStatus] = useState<WatchListStatus | "unwatched">(watchlistItem?.status || "plan to watch");
  const [favorite, setFavorite] = useState<boolean>(!!watchlistItem?.favorite);
  const [rating, setRating] = useState<number>(watchlistItem?.rating || 0);
  const [comment, setComment] = useState<string>(watchlistItem?.comments || "");
  // Para feedback de loading
  const [saving, setSaving] = useState(false);

  // Atualiza estados locais quando watchlistItem muda
  useEffect(() => {
    if (watchlistItem) {
      setStatus(watchlistItem.status);
      setFavorite(!!watchlistItem.favorite);
      setRating(watchlistItem.rating || 0);
      setComment(watchlistItem.comments || "");
    } else {
      setStatus("plan to watch");
      setFavorite(false);
      setRating(0);
      setComment("");
    }
  }, [watchlistItem]);

  // Mutations
  const addToWatchlistMutation = useMutation({
    mutationFn: (data: WatchListCreateDTO) => watchlistService.addToWatchlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({ title: "Adicionado à sua lista!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: (error as Error).message, variant: "destructive" });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (data: { movieId: number, favorite: boolean }) => watchlistService.toggleFavorite(data.movieId, data.favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({ title: favorite ? "Adicionado aos favoritos!" : "Removido dos favoritos!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: (error as Error).message, variant: "destructive" });
    },
  });

  const updateWatchlistMutation = useMutation({
    mutationFn: (data: { movieId: number, status: WatchListStatus, favorite: boolean, comments?: string | null, rating?: number | null }) => {
      return watchlistService.updateWatchlistItem(data.movieId, {
        status: data.status,
        favorite: data.favorite,
        comments: data.comments,
        rating: data.rating,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({ title: "Lista atualizada!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: (error as Error).message, variant: "destructive" });
    },
  });

  if (isLoading || watchlistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando filme...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar filme. Tente novamente.</div>
      </div>
    );
  }

  // Função para salvar alterações (status, favorito, comentário, nota)
  const handleSave = async () => {
    if (status === "unwatched" && watchlistItem) {
      setSaving(true);
      await watchlistService.removeFromWatchlist(movieId);
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({ title: "Filme removido da sua lista!" });
      setSaving(false);
      return;
    }
    if (!watchlistItem) {
      setSaving(true);
      await addToWatchlistMutation.mutateAsync({
        movie_id: movieId,
        status,
        favorite,
        comments: comment || null,
        rating: rating || null,
      });
      setSaving(false);
      return;
    }
    setSaving(true);
    await updateWatchlistMutation.mutateAsync({
      movieId,
      status,
      favorite,
      comments: comment,
      rating: rating,
    });
    setSaving(false);
  };

  // Função para favoritar/desfavoritar
  const handleToggleFavorite = async () => {
    if (!watchlistItem) {
      await addToWatchlistMutation.mutateAsync({ movie_id: movieId, status, favorite: !favorite });
    } else {
      await toggleFavoriteMutation.mutateAsync({ movieId, favorite: !favorite });
    }
    setFavorite((f) => !f);
  };

  // Função para alterar nota
  const handleRatingChange = async (star: number) => {
    setRating(star);
    if (!watchlistItem) {
      await addToWatchlistMutation.mutateAsync({ movie_id: movieId, status, rating: star });
    } else {
      await updateWatchlistMutation.mutateAsync({
        movieId,
        status,
        favorite,
        comments: comment,
        rating: star,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${getImageUrl(movie.background_path)})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <Link 
              to="/home" 
              className="inline-flex items-center text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao catálogo
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-64 mx-auto rounded-lg shadow-2xl"
                />
                {/* Quick Actions */}
                <div className="mt-6 space-y-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white mb-1">Status:</label>
                    <select
                      className="w-full bg-slate-800 text-white rounded px-2 py-1 border border-white/10 focus:border-yellow-400 text-sm"
                      value={status}
                      onChange={e => setStatus(e.target.value as WatchListStatus | "unwatched")}
                      disabled={saving}
                    >
                      <option value="unwatched">Não assistido</option>
                      <option value="plan to watch">Quero Assistir</option>
                      <option value="watching">Assistindo</option>
                      <option value="watched">Assistido</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleToggleFavorite}
                      disabled={saving}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md transition-colors ${
                        favorite 
                          ? 'bg-red-600/20 text-red-400 border border-red-400/50' 
                          : 'bg-gray-600/20 text-gray-300 border border-gray-400/50 hover:bg-gray-500/20'
                      }`}
                    >
                      <Heart className={`h-3 w-3 ${favorite ? 'fill-current' : ''}`} />
                      Favoritos
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-white mb-1">Comentário:</label>
                    <Textarea
                      value={comment}
                      onChange={e => {
                        const value = e.target.value;
                        setComment(value);
                      }}
                      rows={2}
                      maxLength={100}
                      placeholder="Comentário (opcional)"
                      className="bg-slate-800 text-white rounded px-2 py-1 border border-white/10 focus:border-yellow-400 text-sm"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-white mb-1">Nota:</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="text-2xl hover:scale-110 transition-transform duration-200 focus:outline-none"
                          disabled={saving}
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              rating && star <= rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-400 hover:text-yellow-300'
                            }`} 
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="text-white text-sm ml-2">({rating}/5)</span>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : watchlistItem ? "Salvar Alterações" : "Adicionar à Lista"}
                  </Button>
                </div>
              </div>
            </div>
            {/* Right Column - Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {movie.year}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {movie.duration} min
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(movie.genre ?? []).map((genre) => (
                    <Badge key={genre} variant="outline" className="border-yellow-400 text-yellow-400">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Description */}
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-bold">Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-lg leading-relaxed font-medium">
                    {movie.description}
                  </p>
                </CardContent>
              </Card>
              {/* Detalhes extras do TMDb vindos do backend */}
              {(movie.tagline || movie.vote_average || movie.status || movie.release_date || movie.original_title || movie.budget || movie.production_companies) && (
                <Card className="bg-black/60 backdrop-blur-sm border-white/20 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-bold">Detalhes do Filme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6 text-white text-sm">
                      {movie.tagline && (
                        <div className="italic text-yellow-300 w-full">"{movie.tagline}"</div>
                      )}
                      {movie.vote_average !== undefined && (
                        <div><b>Nota TMDb:</b> {movie.vote_average?.toFixed(1) ?? '-'} ({movie.vote_count} votos)</div>
                      )}
                      {movie.popularity !== undefined && (
                        <div><b>Popularidade:</b> {movie.popularity}</div>
                      )}
                      {movie.status && (
                        <div><b>Status:</b> {movie.status}</div>
                      )}
                      {movie.release_date && (
                        <div><b>Lançamento:</b> {movie.release_date}</div>
                      )}
                      {movie.original_title && (
                        <div><b>Título original:</b> {movie.original_title}</div>
                      )}
                      {movie.original_language && (
                        <div><b>Idioma original:</b> {movie.original_language.toUpperCase()}</div>
                      )}
                      {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                        <div><b>Idiomas falados:</b> {movie.spoken_languages.map((l: any) => l.english_name || l.name).join(", ")}</div>
                      )}
                      {movie.production_countries && movie.production_countries.length > 0 && (
                        <div><b>Países:</b> {movie.production_countries.map((c: any) => c.name).join(", ")}</div>
                      )}
                      {movie.production_companies && movie.production_companies.length > 0 && (
                        <div><b>Produtoras:</b> {movie.production_companies.map((c: any) => c.name).join(", ")}</div>
                      )}
                      {movie.budget && movie.budget > 0 && (
                        <div><b>Orçamento:</b> {movie.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}</div>
                      )}
                      {movie.revenue && movie.revenue > 0 && (
                        <div><b>Receita:</b> {movie.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}</div>
                      )}
                      {movie.runtime && (
                        <div><b>Duração:</b> {movie.runtime} min</div>
                      )}
                      {movie.homepage && (
                        <div><b>Site oficial:</b> <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{movie.homepage}</a></div>
                      )}
                      {movie.imdb_id && (
                        <div><b>IMDb:</b> <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ver no IMDb</a></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MovieDetails; 