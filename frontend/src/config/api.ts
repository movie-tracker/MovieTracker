export const API_CONFIG = {
  BASE_URL: 'http://localhost:8888/api',
  ENDPOINTS: {
    // Movies
    MOVIES: '/movies',
    MOVIE_BY_ID: (id: number) => `/movies/${id}`,
    
    // Watchlist
    WATCHLIST: '/watchlist',
    WATCHLIST_BY_ID: (id: number) => `/watchlist/${id}`,
    WATCHLIST_STATUS: (id: number) => `/watchlist/${id}/status`,
    WATCHLIST_FAVORITE: (id: number) => `/watchlist/${id}/favorite`,
    WATCHLIST_RATING: (id: number) => `/watchlist/${id}/rating`,
    
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    
    // Users
    USERS: '/users',
    USER_PROFILE: '/users/profile',
    USER_BY_EMAIL: (email: string) => `/users/by-email/${email}`,
  }
};

export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`; 