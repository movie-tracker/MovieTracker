import { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Search, Star, Heart, Plus, Pencil, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { WatchListDTO, WatchListStatus, MovieDTO, WatchListCreateDTO } from "@/types/movie";
import { watchlistService } from "@/services/watchlistService";
import { movieService } from "@/services/movieService";
import { toast } from "sonner";
import useAuthentication from "@/context/AuthContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function getPosterUrl(posterPath?: string) {
  if (!posterPath) return "https://via.placeholder.com/300x450/666666/FFFFFF?text=Filme";
  return posterPath.startsWith('http') ? posterPath : `${TMDB_IMAGE_BASE}${posterPath}`;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const HomePage = () => {
  const auth = useAuthentication();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [selectedStatus, setSelectedStatus] = useState<WatchListStatus | "all">("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px"
  });

  const [addDialogMovieId, setAddDialogMovieId] = useState<number | null>(null);
  const [selectedStatusDialog, setSelectedStatusDialog] = useState<WatchListStatus | "unwatched">("plan to watch");
  const [isFavoriteDialog, setIsFavoriteDialog] = useState(false);
  const [commentDialog, setCommentDialog] = useState<string>("");
  const [ratingDialog, setRatingDialog] = useState<number | null>(null);

  const {
    data: moviesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: moviesLoading,
    error: moviesError,
  } = useInfiniteQuery({
    queryKey: ["movies-infinite", debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        let result;
        if (debouncedSearchTerm) {
          result = await movieService.searchMovies(debouncedSearchTerm, pageParam);
        } else {
          result = await movieService.getMovies(pageParam);
        }
        return result;
      } catch (error) {
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
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });

  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery<WatchListDTO[]>({
    queryKey: ['watchlist'],
    queryFn: watchlistService.getUserWatchlist,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const hasActiveFilters = selectedStatus !== "all" || showOnlyFavorites;
    
    if (inView && hasNextPage && !isFetchingNextPage && !hasActiveFilters) {
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, selectedStatus, showOnlyFavorites]);

  const openAddDialog = (movie: MovieDTO & { watchlistItem?: WatchListDTO, isInWatchlist?: boolean }) => {
    setAddDialogMovieId(movie.id);
    if (movie.isInWatchlist && movie.watchlistItem) {
      setSelectedStatusDialog(movie.watchlistItem.status);
      setIsFavoriteDialog(!!movie.watchlistItem.favorite);
      setCommentDialog(movie.watchlistItem.comments || "");
      setRatingDialog(typeof movie.watchlistItem.rating === 'number' ? movie.watchlistItem.rating : null);
    } else {
      setSelectedStatusDialog("plan to watch");
      setIsFavoriteDialog(false);
      setCommentDialog("");
      setRatingDialog(null);
    }
  };

  const addToWatchlistMutation = useMutation({
    mutationFn: (data: WatchListCreateDTO) => watchlistService.addToWatchlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Filme adicionado à sua lista!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar filme: ' + (error as Error).message);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { movieId: number, status: WatchListStatus }) => {
      return watchlistService.updateStatus(data.movieId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status: ' + (error as Error).message);
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (data: { movieId: number, favorite: boolean }) => {
      return watchlistService.toggleFavorite(data.movieId, data.favorite);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success(variables.favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar favorito: ' + (error as Error).message);
    }
  });

  const updateWatchlistMutation = useMutation({
    mutationFn: (data: {
      movieId: number,
      status: WatchListStatus,
      favorite: boolean,
      comments?: string | null,
      rating?: number | null
    }) => {
      const requestData = {
        status: data.status,
        favorite: data.favorite,
        comments: data.comments,
        rating: data.rating
      };
      return watchlistService.updateWatchlistItem(data.movieId, requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.refetchQueries({ queryKey: ['watchlist'] });
      toast.success('Lista atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar lista: ' + (error as Error).message);
    }
  });

  const allMovies = useMemo(() => {
    const movies = moviesData?.pages?.flatMap((page: any) => page.results) || [];
    return movies;
  }, [moviesData]);

  const moviesWithStatus = useMemo(() => {
    const movies = allMovies.map((movie: MovieDTO) => {
    const watchlistItem = watchlist.find((w: WatchListDTO) => w.movie_id === movie.id);
    return {
      ...movie,
      watchlistItem,
      isInWatchlist: !!watchlistItem
    };
  });
    return movies;
  }, [allMovies, watchlist]);

  const filteredMovies = useMemo(() => {
    if (selectedStatus === "all" && !showOnlyFavorites) {
      return moviesWithStatus;
    }

    // Se filtro de status está ativo, use a watchlist como fonte principal
    if (selectedStatus !== "all") {
      let filtered = watchlist
        .filter((item: WatchListDTO) => item.status === selectedStatus)
        .map((item: WatchListDTO) => {
          // Procura o filme no catálogo carregado, se não achar, cria um objeto mínimo
          const movie = allMovies.find((m: MovieDTO) => m.id === item.movie_id);
          return movie
            ? { ...movie, watchlistItem: item, isInWatchlist: true }
            : {
                id: item.movie_id,
                title: '',
                year: '',
                duration: '',
                poster_path: '',
                watchlistItem: item,
                isInWatchlist: true,
              };
        });
      if (showOnlyFavorites) {
        filtered = filtered.filter((movie: any) => movie.watchlistItem?.favorite);
      }
      return filtered;
    }

    // Filtro de favoritos no catálogo
    const filtered = moviesWithStatus.filter((movie: MovieDTO & { watchlistItem?: WatchListDTO, isInWatchlist?: boolean }) => {
      if (showOnlyFavorites) {
        if (!movie.isInWatchlist || !movie.watchlistItem?.favorite) return false;
      }
      return true;
    });
    return filtered;
  }, [moviesWithStatus, allMovies, watchlist, selectedStatus, showOnlyFavorites]);

  const stats = useMemo(() => {
    const watchedItems = watchlist.filter((item: WatchListDTO) => item.status === 'watched');
    const watchingItems = watchlist.filter((item: WatchListDTO) => item.status === 'watching');
    const planToWatchItems = watchlist.filter((item: WatchListDTO) => item.status === 'plan to watch');
    const favoriteItems = watchlist.filter((item: WatchListDTO) => item.favorite);

    const moviesOnCurrentPage = selectedStatus === "all" 
      ? allMovies.length 
      : filteredMovies.length;

    return {
      currentPage: moviesOnCurrentPage,
      showing: filteredMovies.length,
      inWatchlist: watchlist.length,
      watched: watchedItems.length,
      watching: watchingItems.length,
      planToWatch: planToWatchItems.length,
      favorites: favoriteItems.length,
  };
  }, [allMovies.length, filteredMovies.length, watchlist, selectedStatus]);

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

  const isSearching = debouncedSearchTerm && moviesLoading;

  if (isLoading && !moviesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando filmes...</div>
      </div>
    );
  }

  if (moviesError) {
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
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <button
                  className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent focus:outline-none hover:underline"
                  onClick={() => {
                    setSelectedStatus("all");
                    setShowOnlyFavorites(false);
                    setSearchTerm("");
                  }}
                  title="Mostrar todos os filmes"
                  style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  Catálogo de Filmes
                </button>
                <span className="text-white text-sm mt-1">Olá, {auth.user?.name || auth.user?.username || 'usuário'}!</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar filmes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onSubmit={(e) => e.preventDefault()}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 w-64"
                />
                {debouncedSearchTerm && moviesLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  </div>
                )}
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as WatchListStatus | "all");
                  setShowOnlyFavorites(false);
                }}
                className="bg-slate-800 border border-white/20 text-white rounded-md px-3 py-2 focus:border-yellow-400 focus:outline-none"
              >
                <option value="all">Todos os Filmes</option>
                {userStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
              <Link
                to="/my-movies"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Meus Filmes
              </Link>
              <Button
                onClick={() => auth.logout()}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-red-600/20 hover:text-red-400 border border-white/20 hover:border-red-400/50 transition-all duration-200"
                title="Sair da conta"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 justify-center mx-auto max-w-5xl">
          <div className="flex justify-center w-full col-span-1 md:col-span-5">
            <button className="focus:outline-none" style={{all: 'unset', cursor: 'pointer'}} onClick={() => { setSelectedStatus("all"); setShowOnlyFavorites(false); setSearchTerm(""); }} title="Mostrar todos os filmes">
              <Card className={`bg-white/5 border-white/10 ${selectedStatus === "all" && !showOnlyFavorites ? 'ring-2 ring-yellow-400' : ''}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{allMovies.length}</div>
                    <div className="text-sm text-gray-400">Filmes</div>
                  </div>
                </CardContent>
              </Card>
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-8 relative">
        {isSearching && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
              <span className="text-white">Buscando filmes...</span>
            </div>
          </div>
        )}
        
        {filteredMovies.length > 0 ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-all duration-300">
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
                        onClick={() => {
                          if (!movie.watchlistItem) return;
                          const currentStatus = movie.watchlistItem.status;
                          let newStatus: WatchListStatus;
                          if (currentStatus === 'plan to watch') {
                            newStatus = 'watching';
                          } else if (currentStatus === 'watching') {
                            newStatus = 'watched';
                          } else {
                            newStatus = 'plan to watch';
                          }
                          updateStatusMutation.mutate({
                            movieId: movie.id,
                            status: newStatus
                          });
                        }}
                        disabled={updateStatusMutation.isPending || toggleFavoriteMutation.isPending}
                        className={`${
                          movie.watchlistItem.status === 'watched' ? 'bg-green-600 hover:bg-green-700' :
                          movie.watchlistItem.status === 'watching' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          movie.watchlistItem.status === 'plan to watch' ? 'bg-blue-600 hover:bg-blue-700' :
                          'bg-red-600 hover:bg-red-700'
                        } text-white border-0 text-xs px-2 py-1 h-6`}
                      >
                        {movie.watchlistItem.status === 'watched' ? 'Assistido' :
                         movie.watchlistItem.status === 'watching' ? 'Assistindo' :
                         movie.watchlistItem.status === 'plan to watch' ? 'Quero Assistir' :
                         'Não Assistido'}
                      </Button>
                    </div>
                  )}

                  {movie.isInWatchlist && movie.watchlistItem && (
                    <div className="absolute top-2 right-2 z-20 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!movie.watchlistItem) return;
                          toggleFavoriteMutation.mutate({
                            movieId: movie.id,
                            favorite: !movie.watchlistItem.favorite
                          });
                        }}
                        disabled={updateStatusMutation.isPending || toggleFavoriteMutation.isPending}
                        className={`${
                          movie.watchlistItem.favorite 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        } text-white border-0 text-xs px-2 py-1 h-6`}
                      >
                        <Heart className={`h-3 w-3 mr-1 ${movie.watchlistItem.favorite ? 'fill-current' : ''}`} />
                        {movie.watchlistItem.favorite ? 'Favorito' : 'Favoritar'}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white hover:bg-gray-200 text-black border-0 p-1 h-7 w-7 shadow-lg ring-2 ring-gray-300 focus:ring-4 focus:ring-gray-400"
                        title="Editar detalhes"
                        onClick={() => {
                          openAddDialog(movie);
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

                  {addDialogMovieId === movie.id && (
                    <div className="z-50 w-56 bg-slate-900 border border-white/20 rounded-lg shadow-xl p-2 animate-fade-in absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="mb-1.5">
                        <label className="block text-white text-xs mb-1">Status:</label>
                        <select
                          className="w-full bg-slate-800 text-white rounded px-2 py-1 border border-white/10 focus:border-yellow-400 text-sm"
                          value={selectedStatusDialog}
                          onChange={e => setSelectedStatusDialog(e.target.value as WatchListStatus | "unwatched")}
                        >
                          <option value="unwatched">Não assistido</option>
                          <option value="plan to watch">Quero Assistir</option>
                          <option value="watching">Assistindo</option>
                          <option value="watched">Assistido</option>
                        </select>
                      </div>
                      <div className="mb-1.5 flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsFavoriteDialog(!isFavoriteDialog)}
                          disabled={addToWatchlistMutation.isPending || updateWatchlistMutation.isPending || updateStatusMutation.isPending || toggleFavoriteMutation.isPending}
                          className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-md transition-colors ${
                            isFavoriteDialog 
                              ? 'bg-red-600/20 text-red-400 border border-red-400/50' 
                              : 'bg-gray-600/20 text-gray-300 border border-gray-400/50 hover:bg-gray-500/20'
                          }`}
                        >
                          <Heart className={`h-3 w-3 ${isFavoriteDialog ? 'fill-current' : ''}`} />
                          Favoritos
                        </Button>
                      </div>
                      <div className="mb-1.5">
                        <label className="block text-white text-xs mb-1">Comentário:</label>
                        <textarea
                          className="w-full bg-slate-800 text-white rounded px-2 py-1 border border-white/10 focus:border-yellow-400 text-sm"
                          value={commentDialog}
                          onChange={e => setCommentDialog(e.target.value === "" ? "" : e.target.value)}
                          rows={2}
                          placeholder="Comentário (opcional)"
                          maxLength={100}
                        />
                      </div>
                      <div className="mb-1.5">
                        <label className="block text-white text-xs mb-1">Nota:</label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingDialog(ratingDialog === star ? null : star)}
                              className="text-xl hover:scale-110 transition-transform duration-200 focus:outline-none"
                            >
                              <Star 
                                className={`h-5 w-5 ${
                                  ratingDialog && star <= ratingDialog 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-400 hover:text-yellow-300'
                                }`} 
                              />
                            </button>
                          ))}
                          {ratingDialog && (
                            <span className="text-white text-sm ml-2">({ratingDialog}/5)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button size="sm" variant="ghost" onClick={() => setAddDialogMovieId(null)} className="text-gray-300 hover:text-white text-xs px-2 py-1">Cancelar</Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                          disabled={addToWatchlistMutation.isPending || updateWatchlistMutation.isPending || updateStatusMutation.isPending || toggleFavoriteMutation.isPending}
                          onClick={() => {
                            if (selectedStatusDialog === "unwatched" && movie.isInWatchlist && movie.watchlistItem) {
                              watchlistService.removeFromWatchlist(movie.id)
                                .then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['watchlist'] });
                                  toast.success('Filme removido da sua lista!');
                                })
                                .catch((error) => {
                                  toast.error('Erro ao remover filme: ' + (error as Error).message);
                                });
                              setAddDialogMovieId(null);
                              return;
                            }
                            if (!movie.isInWatchlist || !movie.watchlistItem) {
                              addToWatchlistMutation.mutate({
                                movie_id: movie.id,
                                status: selectedStatusDialog,
                                favorite: isFavoriteDialog,
                                comments: commentDialog.trim() || null,
                                rating: ratingDialog
                              });
                            } else {
                              const requestData = {
                                movieId: movie.id,
                                status: selectedStatusDialog,
                                favorite: isFavoriteDialog,
                                comments: commentDialog.trim() || null,
                                rating: ratingDialog
                              };
                              updateWatchlistMutation.mutate(requestData);
                            }
                            setAddDialogMovieId(null);
                          }}
                        >
                          {(addToWatchlistMutation.isPending || updateWatchlistMutation.isPending || updateStatusMutation.isPending || toggleFavoriteMutation.isPending) ? 'Salvando...' : 'Salvar'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {!movie.isInWatchlist && (
                      <div className="absolute top-2 right-2 flex flex-col items-end z-20">
                      <Button
                        size="sm"
                          onClick={() => openAddDialog(movie)}
                        disabled={addToWatchlistMutation.isPending || updateWatchlistMutation.isPending || updateStatusMutation.isPending || toggleFavoriteMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white border-0 z-20"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
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

            <div ref={ref} className="h-20 flex items-center justify-center mt-8">
              {isFetchingNextPage && (
                <div className="flex items-center space-x-2 text-white">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                  <span>Carregando mais filmes...</span>
                </div>
              )}
              {!hasNextPage && allMovies.length > 0 && (
                <span className="text-gray-400">
                  {debouncedSearchTerm 
                    ? `Mostrando ${filteredMovies.length} filmes encontrados para "${debouncedSearchTerm}"` 
                    : selectedStatus !== "all" || showOnlyFavorites
                    ? `Mostrando ${filteredMovies.length} filmes encontrados` 
                    : "Você chegou ao final! 🎬"
                  }
                </span>
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