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

  async searchMovies(query: string, page: number = 1): Promise<PaginatedResponse<MovieDTO>> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MOVIES) + `/search?query=${encodeURIComponent(query)}&page=${page}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to search movies');
    }
    
    return response.json();
  },

  async getMovieById(id: number): Promise<MovieDTO> {
    const response = await fetch(`http://localhost:8888/api/movies/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch movie');
    }
    
    return response.json();
  }
}; 