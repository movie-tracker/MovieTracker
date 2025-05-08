import type { Movie, Stats } from '@/types/movie';

const mockMovies: Movie[] = [];

export const getMovies = async (): Promise<Movie[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMovies), 800);
  });
};

export const getStats = async (): Promise<Stats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const watched = mockMovies.filter((m) => m.watched).length;
      const toWatch = mockMovies.length - watched;

      resolve({
        total: mockMovies.length,
        watched,
        toWatch,
      });
    }, 600);
  });
};
