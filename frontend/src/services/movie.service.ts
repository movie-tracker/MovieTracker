import apiClient from '@/services/api';
import { Movie, Pagination, Stats } from '@/types';

const mockMovies: Movie[] = [];

export const discoverMovies = async (): Promise<Pagination<Movie>> => {
  const response = await apiClient.get('/movies');
  return response.data;
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
