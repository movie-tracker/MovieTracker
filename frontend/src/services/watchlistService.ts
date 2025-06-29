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
      const url = getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_STATUS(watchlistId));
      const payload = { status };
      console.log('[PATCH STATUS] URL:', url);
      console.log('[PATCH STATUS] Payload:', payload);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      console.log('[PATCH STATUS] Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[PATCH STATUS] Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Failed to update status');
      }
      const result = await response.json();
      console.log('[PATCH STATUS] Sucesso:', result);
      return result;
    },
  
    // Toggle favorito
    async toggleFavorite(watchlistId: number, favorite: boolean): Promise<WatchListDTO> {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_FAVORITE(watchlistId));
      const payload = { favorite };
      console.log('[PATCH FAVORITE] URL:', url);
      console.log('[PATCH FAVORITE] Payload:', payload);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      console.log('[PATCH FAVORITE] Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[PATCH FAVORITE] Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Failed to toggle favorite');
      }
      const result = await response.json();
      console.log('[PATCH FAVORITE] Sucesso:', result);
      return result;
    },
  
    // Atualizar rating
    async updateRating(watchlistId: number, rating: number): Promise<WatchListDTO> {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_RATING(watchlistId));
      const payload = { rating };
      console.log('[PATCH RATING] URL:', url);
      console.log('[PATCH RATING] Payload:', payload);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      console.log('[PATCH RATING] Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[PATCH RATING] Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Failed to update rating');
      }
      const result = await response.json();
      console.log('[PATCH RATING] Sucesso:', result);
      return result;
    },
  
    // Atualizar item da watchlist
    async updateWatchlistItem(watchlistId: number, data: UpdateWatchlistRequestDTO): Promise<WatchListDTO> {
      console.log('🌐 Fazendo requisição PUT para:', getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_BY_ID(watchlistId)));
      console.log('📤 Dados sendo enviados:', data);
      console.log('📤 JSON sendo enviado:', JSON.stringify(data));
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WATCHLIST_BY_ID(watchlistId)), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Failed to update watchlist item');
      }
      
      const result = await response.json();
      console.log('✅ Resposta de sucesso:', result);
      return result;
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