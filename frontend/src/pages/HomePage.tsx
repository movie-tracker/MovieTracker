import { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Search, Star, Heart, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { WatchListDTO, WatchListStatus, MovieDTO } from "@/types/movie";
import { watchlistService } from "@/services/watchlistService";
import { movieService } from "@/services/movieService";
import { toast } from "sonner";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getPosterUrl(posterPath?: string) {
  return posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : "https://via.placeholder.com/300x450/666666/FFFFFF?text=Filme";
}

// Debounce hook otimizado
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Reduzido de 400 para 300ms
  const [selectedStatus, setSelectedStatus] = useState<WatchListStatus | "all">("all");
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px" // Aumentado para começar a carregar mais cedo
  });

  // Query otimizada com busca local nos dados já carregados
  const {
    data: moviesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: moviesLoading,
    error: moviesError,
  } = useInfiniteQuery({
    queryKey: ["movies"],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`Buscando página ${pageParam}...`);
      try {
        const result = await movieService.getMovies(pageParam);
        console.log(`Página ${pageParam} carregada com ${result.results?.length || 0} filmes`);
        return result;
      } catch (error) {
        console.error(`Erro ao buscar página ${pageParam}:`, error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000, // Aumentado para 10 minutos
    retry: 2, // Reduzido para 2 tentativas
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000), // Backoff mais rápido
  });

  // Watchlist query
  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery<WatchListDTO[]>({
    queryKey: ['watchlist'],
    queryFn: watchlistService.getUserWatchlist,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });

  // Efeito otimizado para carregar próxima página
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      // Debounce do carregamento para evitar múltiplas chamadas
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Mutation para adicionar filme à watchlist
  const addToWatchlistMutation = useMutation({
    mutationFn: (movieId: number) =>
      watchlistService.addToWatchlist({
        movie_id: movieId,
        status: 'plan to watch',
        favorite: false,
        rating: undefined
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Filme adicionado à sua lista!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar filme: ' + (error as Error).message);
    }
  });

  // Processamento otimizado com useMemo
  const allMovies = useMemo(() => {
    return moviesData?.pages?.flatMap(page => page.results) || [];
  }, [moviesData]);

  // Memoização dos filmes com status da watchlist
  const moviesWithStatus = useMemo(() => {
    return allMovies.map((movie: MovieDTO) => {
      const watchlistItem = watchlist.find((w: WatchListDTO) => w.movie_id === movie.id);
      return {
        ...movie,
        watchlistItem,
        isInWatchlist: !!watchlistItem
      };
    });
  }, [allMovies, watchlist]);

  // Filtragem otimizada com memoização
  const filteredMovies = useMemo(() => {
    if (!debouncedSearchTerm && selectedStatus === "all") {
      return moviesWithStatus; // Retorna todos se não há filtros
    }

    return moviesWithStatus.filter((movie: MovieDTO & { watchlistItem?: WatchListDTO, isInWatchlist?: boolean }) => {
      // Filtro de busca otimizado (case-insensitive)
      const matchesSearch = !debouncedSearchTerm || 
        movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro de status otimizado
      if (selectedStatus === "all") return true;
      if (selectedStatus === "unwatched") return !movie.isInWatchlist;
      if (!movie.isInWatchlist) return false;
      
      return movie.watchlistItem?.status === selectedStatus;
    });
  }, [moviesWithStatus, debouncedSearchTerm, selectedStatus]);

  // Estatísticas otimizadas com memoização
  const stats = useMemo(() => {
    const watchedItems = watchlist.filter((item: WatchListDTO) => item.status === 'watched');
    const watchingItems = watchlist.filter((item: WatchListDTO) => item.status === 'watching');
    const planToWatchItems = watchlist.filter((item: WatchListDTO) => item.status === 'plan to watch');
    const favoriteItems = watchlist.filter((item: WatchListDTO) => item.favorite);

    // Número de filmes sendo exibidos na página atual (sem filtros de busca)
    const moviesOnCurrentPage = selectedStatus === "all" && !debouncedSearchTerm 
      ? allMovies.length 
      : filteredMovies.length;

    return {
      currentPage: moviesOnCurrentPage, // Filmes na página atual
      showing: filteredMovies.length, // Filmes sendo exibidos (com filtros)
      inWatchlist: watchlist.length,
      watched: watchedItems.length,
      watching: watchingItems.length,
      planToWatch: planToWatchItems.length,
      favorites: favoriteItems.length,
    };
  }, [allMovies.length, filteredMovies.length, watchlist, selectedStatus, debouncedSearchTerm]);

  const isLoading = moviesLoading || watchlistLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando filmes...</div>
      </div>
    );
  }

  if (moviesError) {
    console.error('Erro detalhado:', moviesError);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-xl mb-4">Erro ao carregar filmes</div>
          <div className="text-sm text-gray-400 mb-4">
            {moviesError instanceof Error ? moviesError.message : 'Erro desconhecido'}
          </div>
          <div className="text-xs text-gray-500">
            Verifique se o backend está rodando em http://localhost:8080
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Catálogo de Filmes
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar filmes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 w-64"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as WatchListStatus | "all")}
                className="bg-slate-800 border border-white/20 text-white rounded-md px-3 py-2 focus:border-yellow-400 focus:outline-none"
              >
                <option value="all">Todos os Filmes ({stats.showing})</option>
                <option value="unwatched">Não na Lista</option>
                <option value="watched">Assistidos</option>
                <option value="watching">Assistindo</option>
                <option value="plan to watch">Quero Assistir</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Stats - Estatísticas aprimoradas */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.currentPage}</div>
                <div className="text-sm text-gray-400">Filmes na Página</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 border-yellow-400/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.showing}</div>
                <div className="text-sm text-gray-400">Sendo Exibidos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.inWatchlist}</div>
                <div className="text-sm text-gray-400">Na Minha Lista</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.watched}</div>
                <div className="text-sm text-gray-400">Assistidos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.watching}</div>
                <div className="text-sm text-gray-400">Assistindo</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.planToWatch}</div>
                <div className="text-sm text-gray-400">Quero Assistir</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.favorites}</div>
                <div className="text-sm text-gray-400">Favoritos</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-8">
        {filteredMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie, index) => (
                <Card key={`${movie.id}-${index}`} className="group bg-white/5 border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy" // Lazy loading para melhor performance
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x450/666666/FFFFFF?text=Filme";
                      }}
                    />
                    
                    {/* Status Badge */}
                    {movie.isInWatchlist && movie.watchlistItem && (
                      <div className="absolute top-2 left-2">
                        <Badge 
                          className={`${
                            movie.watchlistItem.status === 'watched' ? 'bg-green-600' :
                            movie.watchlistItem.status === 'watching' ? 'bg-yellow-600' :
                            movie.watchlistItem.status === 'plan to watch' ? 'bg-blue-600' :
                            'bg-red-600'
                          } text-white border-0`}
                        >
                          {movie.watchlistItem.status === 'watched' ? 'Assistido' :
                           movie.watchlistItem.status === 'watching' ? 'Assistindo' :
                           movie.watchlistItem.status === 'plan to watch' ? 'Quero Assistir' :
                           'Não Assistido'}
                        </Badge>
                      </div>
                    )}

                    {/* Favorite Badge */}
                    {movie.isInWatchlist && movie.watchlistItem?.favorite && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-600 text-white border-0">
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Favorito
                        </Badge>
                      </div>
                    )}

                    {/* Rating Badge */}
                    {movie.isInWatchlist && movie.watchlistItem?.rating && (
                      <div className="absolute top-12 right-2">
                        <Badge className="bg-yellow-600 text-white border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {movie.watchlistItem.rating}/5
                        </Badge>
                      </div>
                    )}

                    {/* Add to Watchlist Button */}
                    {!movie.isInWatchlist && (
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          onClick={() => addToWatchlistMutation.mutate(movie.id)}
                          disabled={addToWatchlistMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white border-0"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    )}

                    {/* Overlay com informações */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <h3 className="font-bold text-lg mb-2">{movie.title || 'Título não disponível'}</h3>
                        <p className="text-sm mb-2">{movie.year || 'Ano não disponível'}</p>
                        <p className="text-sm mb-3">{movie.genre?.length > 0 ? movie.genre.join(', ') : 'Gênero não disponível'}</p>
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

            {/* Elemento de trigger para infinite scroll */}
            <div ref={ref} className="h-20 flex items-center justify-center mt-8">
              {isFetchingNextPage && (
                <div className="flex items-center space-x-2 text-white">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                  <span>Carregando mais filmes...</span>
                </div>
              )}
              {!hasNextPage && allMovies.length > 0 && (
                <span className="text-gray-400">Você chegou ao final! 🎬</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-white py-12">
            <p className="text-xl">Nenhum filme encontrado.</p>
            <p className="text-gray-400 mt-2">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;