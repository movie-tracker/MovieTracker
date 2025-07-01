import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, Plus, Heart } from "lucide-react";
import { MovieDTO, WatchListStatus } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";
import { watchlistService } from "@/services/watchlistService";

interface MovieCardProps {
  movie: MovieDTO;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState<number | null>(null);
  const { toast } = useToast();

  const addToWatchlist = async (status: WatchListStatus) => {
    try {
      const result = await watchlistService.addToWatchlist({
        movie_id: movie.id,
        status,
      });
      
      setIsInWatchlist(true);
      setWatchlistId(result.id);
      toast({
        title: "Adicionado à watchlist!",
        description: `${movie.title} foi adicionado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar à watchlist",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async () => {
    try {
      if (!watchlistId) {
        // Se não está na watchlist, adiciona primeiro
        const result = await watchlistService.addToWatchlist({
          movie_id: movie.id,
          status: "plan to watch",
        });
        setWatchlistId(result.id);
        setIsInWatchlist(true);
      }
      
      // Agora toggle o favorito
      await watchlistService.toggleFavorite(watchlistId!, !isFavorite);
      
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `${movie.title} ${isFavorite ? 'removido' : 'adicionado'} com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group bg-white/5 border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between mb-3">
              <Link to={`/movie/${movie.id}`}>
                <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                  <Play className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={toggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-400' : ''}`} />
              </Button>
            </div>
            
            {!isInWatchlist ? (
              <Button
                size="sm"
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                onClick={() => addToWatchlist("plan to watch")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar à Lista
              </Button>
            ) : (
              <Badge className="w-full justify-center bg-green-600">
                Na Lista
              </Badge>
            )}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white border-0">
            <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
            8.5
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 