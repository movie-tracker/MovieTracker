import { Heart, PlayCircle, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

export interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  rating: number;
  overview: string;
  isFavorite?: boolean;
  isWatched?: boolean;
  onToggleFavorite?: () => void;
  onToggleWatched?: () => void;
  onRemove?: () => void;
}

export function MovieCard({
  id,
  title,
  posterUrl,
  releaseYear,
  rating,
  overview,
  isFavorite,
  isWatched,
  onToggleFavorite,
  onToggleWatched,
  onRemove,
}: MovieCardProps) {
  return (
    <Card className="bg-slate-800 rounded-lg shadow overflow-hidden flex flex-col">
      <CardHeader className="relative p-0">
        <Link to={`/movie/${id}`}>
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-auto object-cover rounded-t-lg hover:opacity-80 transition-opacity"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl line-clamp-1 text-white">{title}</CardTitle>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-300 font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-300">{releaseYear}</span>
        </div>
        <CardDescription className="line-clamp-3 text-gray-200">{overview}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onToggleFavorite && (
          <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
          </Button>
        )}
        {onToggleWatched && (
          <Button variant="ghost" size="icon" onClick={onToggleWatched}>
            <PlayCircle className={`w-5 h-5 ${isWatched ? 'fill-green-500 text-green-500' : ''}`} />
          </Button>
        )}
        {onRemove && (
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 