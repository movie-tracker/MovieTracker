import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { MovieOptions } from '@/components/ui/movie-options';
import { Button } from '@/components/ui/button';

// TODO: Substituir por API
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  rating: number;
  overview: string;
  isWatched?: boolean;
  isFavorite?: boolean;
  userRating?: number;
  userComment?: string;
}

export default function WatchedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([
    {
      id: '1',
      title: 'The Shawshank Redemption',
      posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      releaseYear: '1994',
      rating: 9.3,
      overview:
        'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.',
      isWatched: true,
      isFavorite: false,
      userRating: 0,
      userComment: '',
    },
    {
      id: '2',
      title: 'Inception',
      posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      releaseYear: '2010',
      rating: 8.8,
      overview:
        'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception".',
      isWatched: true,
      isFavorite: true,
      userRating: 5,
      userComment: 'Um dos melhores filmes de ficção científica!',
    },
    {
      id: '3',
      title: 'Interstellar',
      posterUrl: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      releaseYear: '2014',
      rating: 8.6,
      overview:
        'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      isWatched: true,
      isFavorite: false,
      userRating: 4,
      userComment: 'Visual incrível e história emocionante.',
    },
    {
      id: '4',
      title: 'The Godfather',
      posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      releaseYear: '1972',
      rating: 9.2,
      overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      isWatched: true,
      isFavorite: false,
      userRating: 5,
      userComment: 'Clássico absoluto do cinema!',
    },
    {
      id: '5',
      title: 'The Lord of the Rings: The Return of the King',
      posterUrl: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      releaseYear: '2003',
      rating: 8.9,
      overview: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
      isWatched: true,
      isFavorite: true,
      userRating: 5,
      userComment: 'Aventura épica do início ao fim.',
    },
    {
      id: '6',
      title: 'Forrest Gump',
      posterUrl: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
      releaseYear: '1994',
      rating: 8.8,
      overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.',
      isWatched: false,
      isFavorite: true,
      userRating: 0,
      userComment: '',
    },
  ]);

  const handleToggleFavorite = (movieId: string) => {
    setWatchedMovies(movies =>
      movies.map(movie =>
        movie.id === movieId
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      )
    );
  };

  const handleToggleWatched = (movieId: string) => {
    setWatchedMovies(movies =>
      movies.map(movie =>
        movie.id === movieId
          ? { ...movie, isWatched: !movie.isWatched }
          : movie
      )
    );
  };

  const handleRate = (movieId: string, rating: number) => {
    setWatchedMovies(movies =>
      movies.map(movie =>
        movie.id === movieId
          ? { ...movie, userRating: rating }
          : movie
      )
    );
  };

  const handleComment = (movieId: string, comment: string) => {
    setWatchedMovies(movies =>
      movies.map(movie =>
        movie.id === movieId
          ? { ...movie, userComment: comment }
          : movie
      )
    );
  };

  const handleRemove = (movieId: string) => {
    setWatchedMovies(movies => movies.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="w-full min-h-screen bg-white py-8 px-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.backToDashboard', 'Back to Dashboard')}
        </Button>
        <h1 className="text-4xl font-bold text-center text-black">{t('watched.title', 'Watched Movies')}</h1>
      </div>
      {watchedMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">{t('watched.empty', 'No watched movies yet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto justify-center">
          {watchedMovies.map((movie) => (
            <div
              key={movie.id}
              className="w-80 bg-slate-800 rounded-lg shadow-lg flex flex-col items-center mx-auto"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-80 object-cover rounded-t-lg"
              />
              <div className="flex-1 flex flex-col items-center p-5 w-full">
                <h2 className="text-xl font-bold text-center mb-1 text-white truncate w-full">{movie.title}</h2>
                <div className="text-gray-400 text-sm mb-1">{movie.releaseYear}</div>
                <div className="text-yellow-400 font-semibold mb-2">⭐ {movie.rating}</div>
                <p className="text-gray-300 text-sm text-center mb-4 line-clamp-3">{movie.overview}</p>
                <MovieOptions
                  movieId={movie.id}
                  isWatched={movie.isWatched || false}
                  isFavorite={movie.isFavorite || false}
                  rating={movie.userRating || 0}
                  comment={movie.userComment || ''}
                  onToggleWatched={() => handleToggleWatched(movie.id)}
                  onToggleFavorite={() => handleToggleFavorite(movie.id)}
                  onRate={(rating) => handleRate(movie.id, rating)}
                  onComment={(comment) => handleComment(movie.id, comment)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 