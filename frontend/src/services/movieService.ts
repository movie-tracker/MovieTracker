import { MovieDTO } from '@/types/movie';
import { getApiUrl, API_CONFIG } from '@/config/api';

interface PaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const movieService = {
  // Buscar todos os filmes
  async getMovies(page: number): Promise<PaginatedResponse<MovieDTO>> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MOVIES) + `?page=${page}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch movies');
    }
    
    return response.json();
  },

  // Buscar filme por ID
  async getMovieById(id: number): Promise<MovieDTO> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MOVIE_BY_ID(id)), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch movie');
    }
    
    return response.json();
  }
}; 