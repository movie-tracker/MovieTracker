import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Film, 
  Eye, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar,
  Plus,
  Play,
  CheckCircle,
  Search
} from "lucide-react";
import { WatchListDTO } from "@/types/movie";
import { watchlistService } from "@/services/watchlistService";

const Dashboard = () => {
  const { data: watchlist = [], isLoading, error } = useQuery<WatchListDTO[]>({
    queryKey: ['watchlist'],
    queryFn: watchlistService.getUserWatchlist,
  });

  // Calcular estatísticas
  const stats = {
    total: watchlist.length,
    watched: watchlist.filter(item => item.status === 'watched').length,
    watching: watchlist.filter(item => item.status === 'watching').length,
    planToWatch: watchlist.filter(item => item.status === 'plan to watch').length,
    favorites: watchlist.filter(item => item.favorite).length,
  };

  const recentMovies = watchlist
    .filter(item => item.status === 'watched')
    .slice(0, 5);

  const upcomingMovies = watchlist
    .filter(item => item.status === 'plan to watch')
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar dashboard. Tente novamente.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Bem-vindo de volta! Aqui está o resumo da sua atividade.</p>
          </div>
          <Link to="/home">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="h-4 w-4 mr-2" />
              Ver Meus Filmes
              </Button>
            </Link>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Film className="h-8 w-8 text-blue-400" />
            </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Assistidos</p>
                  <p className="text-2xl font-bold text-white">{stats.watched}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Assistindo</p>
                  <p className="text-2xl font-bold text-white">{stats.watching}</p>
                </div>
                <Play className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Para Assistir</p>
                  <p className="text-2xl font-bold text-white">{stats.planToWatch}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
            </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Favoritos</p>
                  <p className="text-2xl font-bold text-white">{stats.favorites}</p>
            </div>
                <Star className="h-8 w-8 text-red-400" />
          </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Movies */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-400" />
                Filmes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMovies.length > 0 ? (
                <div className="space-y-4">
                  {recentMovies.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-gray-600 rounded"></div>
                        <div>
                          <p className="text-white font-medium">Filme #{item.movie_id}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
                              Assistido
                            </Badge>
                            {item.rating && (
                              <div className="flex items-center text-yellow-400 text-sm">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {item.rating}/10
                              </div>
                            )}
          </div>
        </div>
      </div>
                      <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
              ) : (
                <div className="text-center py-8">
                  <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum filme assistido ainda</p>
                  <Link to="/home">
                    <Button variant="outline" className="mt-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20">
                      Ver Meus Filmes
                    </Button>
                  </Link>
        </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Movies */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Próximos Filmes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMovies.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMovies.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-gray-600 rounded"></div>
                        <div>
                          <p className="text-white font-medium">Filme #{item.movie_id}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="border-blue-400 text-blue-400 text-xs">
                              Para Assistir
                            </Badge>
                            {item.favorite && (
                              <Star className="h-3 w-3 text-red-400 fill-current" />
                            )}
          </div>
              </div>
            </div>
                      <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/20">
                        Assistir
                      </Button>
              </div>
                  ))}
            </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum filme na lista de desejos</p>
                  <Link to="/home">
                    <Button variant="outline" className="mt-4 border-blue-400 text-blue-400 hover:bg-blue-400/20">
                      Ver Meus Filmes
                    </Button>
                  </Link>
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-yellow-400" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/home">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Meus Filmes
                </Button>
              </Link>
              <Link to="/explore">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Search className="h-4 w-4 mr-2" />
                  Explorar Filmes
            </Button>
          </Link>
              <Button variant="outline" className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400/20">
                <Star className="h-4 w-4 mr-2" />
                Ver Favoritos
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
    </div>
  );
};

export default Dashboard;