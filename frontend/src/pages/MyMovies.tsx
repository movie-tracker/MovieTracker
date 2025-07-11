import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Heart, Pencil, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { WatchListDTO, WatchListStatus, MovieDTO } from "@/types/movie";
import { watchlistService } from "@/services/watchlistService";
import { movieService } from "@/services/movieService";
import useAuthentication from "@/context/AuthContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function getPosterUrl(posterPath?: string) {
  if (!posterPath) return "https://via.placeholder.com/300x450/666666/FFFFFF?text=Filme";
  return posterPath.startsWith('http') ? posterPath : `${TMDB_IMAGE_BASE}${posterPath}`;
}

const MyMovies = () => {
  const auth = useAuthentication();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<WatchListStatus | "all">("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortOption, setSortOption] = useState<string>("alphabetical-asc");

  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery<WatchListDTO[]>({
    queryKey: ['watchlist'],
    queryFn: watchlistService.getUserWatchlist,
    staleTime: 5 * 60 * 1000,
  });

  const { data: moviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ['my-movies', watchlist],
    queryFn: async () => {
      if (watchlist.length === 0) return [];
      const moviePromises = watchlist.map(item => 
        movieService.getMovieById(item.movie_id)
          .catch(() => null)
      );
      const movies = await Promise.all(moviePromises);
      return movies.filter(Boolean);
    },
    enabled: watchlist.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const moviesWithStatus = useMemo(() => {
    if (!moviesData || !watchlist) return [];
    return (moviesData as MovieDTO[])
      .filter((movie): movie is MovieDTO => movie !== null)
      .map((movie: MovieDTO) => {
      const watchlistItem = watchlist.find((w: WatchListDTO) => w.movie_id === movie.id);
      return {
        ...movie,
        watchlistItem,
        isInWatchlist: !!watchlistItem
      };
    });
  }, [moviesData, watchlist]);

  const filteredMovies = useMemo(() => {
    let filtered = moviesWithStatus;
    if (searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (showOnlyFavorites) {
      filtered = filtered.filter((movie) =>
        movie.watchlistItem?.favorite
      );
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter((movie) =>
        movie.watchlistItem?.status === selectedStatus
      );
    }
    const compare = (a: any, b: any) => {
      switch (sortOption) {
        case "alphabetical-asc":
          return a.title.localeCompare(b.title);
        case "alphabetical-desc":
          return b.title.localeCompare(a.title);
        case "rating-desc":
          return (b.watchlistItem?.rating || 0) - (a.watchlistItem?.rating || 0);
        case "rating-asc":
          return (a.watchlistItem?.rating || 0) - (b.watchlistItem?.rating || 0);
        case "year-desc":
          return Number(b.year) - Number(a.year);
        case "year-asc":
          return Number(a.year) - Number(b.year);
        case "status":
          const order: Record<string, number> = { watched: 0, watching: 1, "plan to watch": 2, unwatched: 3 };
          return (order[String(a.watchlistItem?.status)] ?? 4) - (order[String(b.watchlistItem?.status)] ?? 4);
        default:
          return 0;
      }
    };
    return [...filtered].sort(compare);
  }, [moviesWithStatus, searchTerm, selectedStatus, showOnlyFavorites, sortOption]);

  const stats = useMemo(() => {
    const watchedItems = watchlist.filter((item: WatchListDTO) => item.status === 'watched');
    const watchingItems = watchlist.filter((item: WatchListDTO) => item.status === 'watching');
    const planToWatchItems = watchlist.filter((item: WatchListDTO) => item.status === 'plan to watch');
    const favoriteItems = watchlist.filter((item: WatchListDTO) => item.favorite);
    return {
      total: watchlist.length,
      watched: watchedItems.length,
      watching: watchingItems.length,
      planToWatch: planToWatchItems.length,
      favorites: favoriteItems.length,
      showing: filteredMovies.length,
    };
  }, [watchlist, filteredMovies.length]);

  const userStatuses = useMemo(() => {
    const statusSet = new Set<WatchListStatus>();
    watchlist.forEach((item: WatchListDTO) => {
      statusSet.add(item.status);
    });
    return Array.from(statusSet);
  }, [watchlist]);

  const getStatusLabel = (status: WatchListStatus) => {
    switch (status) {
      case 'watched': return 'Assistidos';
      case 'watching': return 'Assistindo';
      case 'plan to watch': return 'Quero Assistir';
      default: return status;
    }
  };

  const isLoading = moviesLoading || watchlistLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando seus filmes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                to="/home" 
                className="inline-flex items-center text-white hover:text-yellow-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar ao catálogo
              </Link>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Meus Filmes
                </h1>
                <span className="text-white text-sm mt-1">Olá, {auth.user?.name || auth.user?.username || 'usuário'}!</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar meus filmes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 w-64"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as WatchListStatus | "all");
                  setShowOnlyFavorites(false);
                }}
                className="bg-slate-800 border border-white/20 text-white rounded-md px-3 py-2 focus:border-yellow-400 focus:outline-none"
              >
                <option value="all">Todos os Meus Filmes</option>
                {userStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="bg-slate-800 border border-white/20 text-white rounded-md px-3 py-2 focus:border-yellow-400 focus:outline-none"
                title="Ordenar por"
              >
                <option value="alphabetical-asc">A-Z (Ordem Alfabética)</option>
                <option value="alphabetical-desc">Z-A (Ordem Alfabética)</option>
                <option value="rating-desc">Nota (Maior para Menor)</option>
                <option value="rating-asc">Nota (Menor para Maior)</option>
                <option value="year-desc">Ano (Mais Recente)</option>
                <option value="year-asc">Ano (Mais Antigo)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 justify-center mx-auto max-w-5xl">
          <button className="focus:outline-none" style={{all: 'unset', cursor: 'pointer'}} onClick={() => { setSelectedStatus("all"); setShowOnlyFavorites(false); setSearchTerm(""); }} title="Mostrar todos os meus filmes">
            <Card className={`bg-white/5 border-white/10 ${selectedStatus === "all" && !showOnlyFavorites ? 'ring-2 ring-yellow-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
              </CardContent>
            </Card>
          </button>
          <button className="focus:outline-none" style={{all: 'unset', cursor: 'pointer'}} onClick={() => { setSelectedStatus("watching"); setShowOnlyFavorites(false); setSearchTerm(""); }} title="Filmes assistindo">
            <Card className={`bg-white/5 border-white/10 ${selectedStatus === "watching" ? 'ring-2 ring-yellow-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.watching}</div>
                  <div className="text-sm text-gray-400">Assistindo</div>
                </div>
              </CardContent>
            </Card>
          </button>
          <button className="focus:outline-none" style={{all: 'unset', cursor: 'pointer'}} onClick={() => { setSelectedStatus("plan to watch"); setShowOnlyFavorites(false); setSearchTerm(""); }} title="Filmes que quero assistir">
            <Card className={`bg-white/5 border-white/10 ${selectedStatus === "plan to watch" ? 'ring-2 ring-purple-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.planToWatch}</div>
                  <div className="text-sm text-gray-400">Quero Assistir</div>
                </div>
              </CardContent>
            </Card>
          </button>
          <button className="focus:outline-none" style={{all: 'unset', cursor: 'pointer'}} onClick={() => { setSelectedStatus("watched"); setShowOnlyFavorites(false); setSearchTerm(""); }} title="Filmes assistidos">
            <Card className={`bg-white/5 border-white/10 ${selectedStatus === "watched" ? 'ring-2 ring-green-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.watched}</div>
                  <div className="text-sm text-gray-400">Assistidos</div>
                </div>
              </CardContent>
            </Card>
          </button>
          <button className="focus:outline-none" style={{all: 'unset', cursor: 'pointer'}} onClick={() => { setShowOnlyFavorites(true); setSelectedStatus("all"); }} title="Filmes favoritos">
            <Card className={`bg-white/5 border-white/10 ${showOnlyFavorites ? 'ring-2 ring-red-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.favorites}</div>
                  <div className="text-sm text-gray-400">Favoritos</div>
                </div>
              </CardContent>
            </Card>
          </button>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-8">
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie, index) => (
              <Card key={`${movie.id}-${index}`} className="group bg-white/5 border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x450/666666/FFFFFF?text=Filme";
                    }}
                  />
                  {movie.isInWatchlist && movie.watchlistItem && (
                    <div className="absolute top-2 left-2 z-20">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={
                          `${
                            movie.watchlistItem.status === 'watched'
                              ? 'bg-green-600 hover:bg-green-700'
                              : movie.watchlistItem.status === 'watching'
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : movie.watchlistItem.status === 'plan to watch'
                              ? '!bg-blue-600 !hover:bg-blue-700'
                              : 'bg-red-600 hover:bg-red-700'
                          } text-white border-0 text-xs px-2 py-1 h-6`
                        }
                      >
                        {movie.watchlistItem.status === 'watched'
                          ? 'Assistido'
                          : movie.watchlistItem.status === 'watching'
                          ? 'Assistindo'
                          : movie.watchlistItem.status === 'plan to watch'
                          ? 'Quero Assistir'
                          : 'Não Assistido'}
                      </Button>
                    </div>
                  )}
                  {movie.isInWatchlist && movie.watchlistItem && (
                    <div className="absolute top-2 right-2 z-20 flex gap-2">
                      {movie.watchlistItem.favorite && (
                        <Badge className="bg-red-600 text-white border-0 text-xs px-2 py-1">
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Favorito
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white hover:bg-gray-200 text-black border-0 p-1 h-7 w-7 shadow-lg ring-2 ring-gray-300 focus:ring-4 focus:ring-gray-400"
                        title="Editar detalhes"
                        onClick={() => {
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {movie.isInWatchlist && movie.watchlistItem?.rating && (
                    <div className="absolute top-12 right-2 z-20">
                      <Badge className="bg-yellow-600 text-white border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {movie.watchlistItem.rating}/5
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="text-center text-white p-4">
                      <h3 className="font-bold text-lg mb-2">{movie.title || 'Título não disponível'}</h3>
                      <p className="text-sm mb-2">{movie.year || 'Ano não disponível'}</p>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate">{movie.title || 'Título não disponível'}</h3>
                  <p className="text-gray-400 text-xs">{movie.year || 'N/A'} • {movie.duration || 'N/A'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-white py-12">
            <p className="text-xl">Nenhum filme encontrado.</p>
            <p className="text-gray-400 mt-2">
              {watchlist.length === 0 
                ? "Você ainda não adicionou nenhum filme à sua lista. Vá ao catálogo para começar!" 
                : "Tente ajustar os filtros de busca."
              }
            </p>
            {watchlist.length === 0 && (
              <Link
                to="/home"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors mt-4"
              >
                Ir para o Catálogo
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyMovies; 