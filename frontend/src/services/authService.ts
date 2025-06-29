import { getApiUrl, API_CONFIG } from '@/config/api';

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  authToken: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  // Login
  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    
    return response.json();
  },

  // Register
  async register(userData: RegisterRequestDTO): Promise<UserDTO> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return response.json();
  },

  // Get user profile
  async getProfile(): Promise<UserDTO> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE), {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get profile');
    }
    
    return response.json();
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<UserDTO> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(getApiUrl(`/users/by-email/${email}`), {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get user');
    }
    
    return response.json();
  }
}; 