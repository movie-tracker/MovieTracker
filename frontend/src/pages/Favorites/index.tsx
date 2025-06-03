import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { MovieCard } from '@/components/ui/movie-card';
import { Button } from '@/components/ui/button';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  rating: number;
  overview: string;
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // TODO: Chamar API
  const favoriteMovies: Movie[] = [
    {
      id: '1',
      title: 'Inception',
      posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      releaseYear: '2010',
      rating: 8.8,
      overview:
        'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception".',
    },
  ];

  const handleToggleFavorite = (movieId: string) => {
    // TODO: Implementar logica
    console.log('Toggle favorite for movie:', movieId);
  };
  
  const handleToggleWatched = (movieId: string) => {
    // TODO: Implementar logica
    console.log('Toggle watched for movie:', movieId);
  };

  const handleRemove = (movieId: string) => {
    // TODO: Implementar logica
    console.log('Remove movie:', movieId);
  };

  return (
    <div className="w-full min-h-screen bg-white py-8 px-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.backToDashboard', 'Back to Dashboard')}
        </Button>
        <h1 className="text-4xl font-bold text-black text-center">{t('favorites.title', 'Favorite Movies')}</h1>
      </div>
      {favoriteMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">{t('favorites.empty', 'No favorite movies yet')}</p>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
            {favoriteMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                {...movie}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFavorite(movie.id)}
                onToggleWatched={() => handleToggleWatched(movie.id)}
                onRemove={() => handleRemove(movie.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 