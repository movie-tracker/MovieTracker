import { 
    WatchListDTO, 
    WatchListCreateDTO, 
    UpdateStatusRequestDTO, 
    ToggleFavoriteRequestDTO, 
    UpdateRatingRequestDTO,
    UpdateWatchlistRequestDTO 
  } from '@/types/movie';
  import { getApiUrl, API_CONFIG } from '@/config/api';
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };
  
  export const watchlistService = {
    // Buscar watchlist do usuário
    async getUserWatchlist(): Promise<WatchListDTO[]> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST), {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch watchlist');
      }
      
      return response.json();
    },
  
    // Adicionar filme à watchlist
    async addToWatchlist(data: WatchListCreateDTO): Promise<WatchListDTO> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add to watchlist');
      }
      
      return response.json();
    },
  
    // Atualizar status do filme na watchlist
    async updateStatus(watchlistId: number, status: string): Promise<WatchListDTO> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_STATUS(watchlistId)), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      return response.json();
    },
  
    // Toggle favorito
    async toggleFavorite(watchlistId: number, favorite: boolean): Promise<WatchListDTO> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_FAVORITE(watchlistId)), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ favorite }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to toggle favorite');
      }
      
      return response.json();
    },
  
    // Atualizar rating
    async updateRating(watchlistId: number, rating: number): Promise<WatchListDTO> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_RATING(watchlistId)), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update rating');
      }
      
      return response.json();
    },
  
    // Atualizar item da watchlist
    async updateWatchlistItem(watchlistId: number, data: UpdateWatchlistRequestDTO): Promise<WatchListDTO> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_BY_ID(watchlistId)), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update watchlist item');
      }
      
      return response.json();
    },
  
    // Remover da watchlist
    async removeFromWatchlist(watchlistId: number): Promise<void> {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_BY_ID(watchlistId)), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove from watchlist');
      }
    }
  };