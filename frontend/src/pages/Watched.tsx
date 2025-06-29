import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Star, Calendar, Filter } from "lucide-react";
import { WatchListDTO } from "@/types/movie";
import { watchlistService } from "@/services/watchlistService";

const WatchedPage = () => {
  const { data: watchlist = [], isLoading, error } = useQuery<WatchListDTO[]>({
    queryKey: ['watchlist'],
    queryFn: watchlistService.getUserWatchlist,
  });

  // Filtrar apenas filmes assistidos
  const watchedMovies = watchlist.filter(item => item.status === 'watched');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando filmes assistidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar filmes assistidos. Tente novamente.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Eye className="h-8 w-8 mr-3 text-green-400" />
              Filmes Assistidos
            </h1>
            <p className="text-gray-300">
              {watchedMovies.length} filme{watchedMovies.length !== 1 ? 's' : ''} assistido{watchedMovies.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Link to="/movies">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                Adicionar Filme
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{watchedMovies.length}</div>
                <div className="text-sm text-gray-400">Total Assistidos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {watchedMovies.length > 0 
                    ? (watchedMovies.reduce((sum, item) => sum + (item.rating || 0), 0) / watchedMovies.filter(item => item.rating).length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <div className="text-sm text-gray-400">Nota Média</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {watchedMovies.filter(item => item.favorite).length}
                </div>
                <div className="text-sm text-gray-400">Favoritos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {watchedMovies.filter(item => item.comments).length}
                </div>
                <div className="text-sm text-gray-400">Com Comentários</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movies List */}
        {watchedMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchedMovies.map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10 hover:border-green-400/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-24 bg-gray-600 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-2">Filme #{item.movie_id}</h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className="bg-green-600 text-white text-xs">
                          Assistido
                        </Badge>
                        {item.favorite && (
                          <Badge className="bg-red-600 text-white text-xs">
                            Favorito
                          </Badge>
                        )}
                      </div>
                      
                      {item.rating && (
                        <div className="flex items-center text-yellow-400 mb-2">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          <span className="text-sm">{item.rating}/10</span>
                        </div>
                      )}
                      
                      {item.comments && (
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                          "{item.comments}"
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Adicionado recentemente</span>
                        </div>
                        <Link to={`/movie/${item.movie_id}`}>
                          <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/20">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="text-center py-16">
              <Eye className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum filme assistido ainda</h3>
              <p className="text-gray-400 mb-6">
                Comece a assistir filmes e eles aparecerão aqui automaticamente
              </p>
              <Link to="/movies">
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  Explorar Filmes
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WatchedPage; 