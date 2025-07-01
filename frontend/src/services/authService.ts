import { getApiUrl, API_CONFIG } from '@/config/api';

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  name: string;
  username: string;
  email: string;
  phone?: string;
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
      
      // Tratar erros específicos de login
      if (response.status === 401) {
        throw new Error('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.');
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Dados de login inválidos. Verifique os campos e tente novamente.');
      } else if (response.status === 500) {
        throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        throw new Error(errorData.message || 'Erro ao fazer login. Tente novamente.');
      }
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
      
      // Tratar erros específicos de registro
      if (response.status === 409) {
        if (errorData.message?.includes('email') || errorData.message?.includes('Email')) {
          throw new Error('Este email já está em uso. Tente usar outro email ou faça login se já possui uma conta.');
        } else if (errorData.message?.includes('username') || errorData.message?.includes('Username')) {
          throw new Error('Este nome de usuário já está em uso. Escolha outro nome de usuário.');
        } else {
          throw new Error('Dados já existem no sistema. Verifique email e nome de usuário.');
        }
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Dados de registro inválidos. Verifique os campos e tente novamente.');
      } else if (response.status === 500) {
        throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        throw new Error(errorData.message || 'Erro ao criar conta. Tente novamente.');
      }
    }
    
    return response.json();
  },

  // Get user profile
  async getProfile(): Promise<UserDTO> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(getApiUrl('/users/profile'), {
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