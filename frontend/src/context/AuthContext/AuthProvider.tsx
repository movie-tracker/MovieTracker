import { useQuery, useQueryClient } from '@tanstack/react-query';

import useLocalStorage from '@/hooks/useLocalStorage';
import { authService } from '@/services/authService';
import UserDTO from '@/services/dto/user.dto';

import AuthContext, { IAuthContext } from './auth.context';

function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [authToken, setAuthToken] = useLocalStorage('authToken');
  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserDTO, Error>({
    queryKey: ['profile'],
    queryFn: async () => authService.getProfile(),
    enabled: !!authToken,
    retry: false,
  });

  // Se há token mas a query falhou (token inválido), limpar o token
  if (authToken && profileQuery.error) {
    setAuthToken(null);
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  }

  // Só considerar autenticado se há token E não há erro na query
  const isAuthenticated = !!authToken && !profileQuery.error;

  async function login(username: string, password: string) {
    const { authToken: token } = await authService.login({ username, password });
    setAuthToken(token);
  }

  async function logout() {
    setAuthToken(null);
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  }

  const context: IAuthContext = {
    user: profileQuery.data,
    profileQuery,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
