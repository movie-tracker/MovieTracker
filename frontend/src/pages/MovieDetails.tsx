import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Clock, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieDTO, WatchListStatus } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";
import { movieService } from "@/services/movieService";
import { watchlistService } from "@/services/watchlistService";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [watchlistStatus, setWatchlistStatus] = useState<WatchListStatus | null>(null);
  const [watchlistId, setWatchlistId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: movie, isLoading, error } = useQuery<MovieDTO>({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieById(Number(id)),
    enabled: !!id,
  });

  const handleRating = async (rating: number) => {
    try {
      if (!watchlistId) {
        // Se não está na watchlist, adiciona primeiro
        const result = await watchlistService.addToWatchlist({
          movie_id: movie!.id,
          status: "watched",
        });
        setWatchlistId(result.id);
        setWatchlistStatus("watched");
      }
      
      // Agora atualiza o rating
      await watchlistService.updateRating(watchlistId!, rating);
      
      setUserRating(rating);
      toast({
        title: "Avaliação salva!",
        description: `Você avaliou ${movie?.title} com ${rating} estrelas`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a avaliação",
        variant: "destructive",
      });
    }
  };

  const addToWatchlist = async (status: WatchListStatus) => {
    try {
      if (!movie) return;
      
      const result = await watchlistService.addToWatchlist({
        movie_id: movie.id,
        status,
      });
      
      setWatchlistStatus(status);
      setWatchlistId(result.id);
      toast({
        title: "Adicionado à watchlist!",
        description: `${movie.title} foi marcado como "${status}"`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar à watchlist",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${movie.background_path})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <Link 
              to="/explore" 
              className="inline-flex items-center text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos filmes
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
                
                {/* Quick Actions */}
                <div className="mt-6 space-y-3">
                  {!watchlistStatus ? (
                    <>
                      <Button 
                        onClick={() => addToWatchlist("plan to watch")}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Quero Assistir
                      </Button>
                      <Button 
                        onClick={() => addToWatchlist("watched")}
                        variant="outline"
                        className="w-full border-green-500 text-green-400 hover:bg-green-500/20"
                      >
                        Marcar como Assistido
                      </Button>
                    </>
                  ) : (
                    <Badge className="w-full justify-center py-2 bg-green-600">
                      {watchlistStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
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
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    8.5 (1,234 avaliações)
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((genre) => (
                    <Badge key={genre} variant="outline" className="border-yellow-400 text-yellow-400">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {movie.description}
                  </p>
                </CardContent>
              </Card>

              {/* User Rating */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Sua Avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`h-8 w-8 ${
                          star <= userRating 
                            ? 'text-yellow-400' 
                            : 'text-gray-600 hover:text-yellow-300'
                        } transition-colors`}
                      >
                        <Star className="h-full w-full fill-current" />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="text-white ml-2">
                        {userRating}/5 estrelas
                      </span>
                    )}
                  </div>
                  
                  <Textarea
                    placeholder="Escreva um comentário sobre o filme..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  
                  <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Salvar Comentário
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10 text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-400">8.5</div>
                    <div className="text-sm text-gray-400">Nota Média</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-400">1,234</div>
                    <div className="text-sm text-gray-400">Avaliações</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-400">89%</div>
                    <div className="text-sm text-gray-400">Aprovação</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MovieDetails; 