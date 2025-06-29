import { getApiUrl, API_CONFIG } from '@/config/api';
import { authService, UserDTO } from './authService';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const userService = {
  // Buscar todos os usuários
  async getUsers(): Promise<UserDTO[]> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USERS), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    
    return response.json();
  },

  // Buscar perfil do usuário
  async getProfile(): Promise<UserDTO> {
    return authService.getProfile();
  },

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<UserDTO> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_BY_EMAIL(email)), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get user');
    }
    
    return response.json();
  },

  // Criar novo usuário
  async createUser(userData: { username: string; email: string; password: string }): Promise<UserDTO> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USERS), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create user');
    }
    
    return response.json();
  }
}; 