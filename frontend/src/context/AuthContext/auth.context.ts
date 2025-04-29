import { UseQueryResult } from '@tanstack/react-query';
import { createContext } from 'react';

import UserDTO from '@/services/dto/user.dto';

export interface IAuthContext {
  user?: UserDTO;
  profileQuery: UseQueryResult<UserDTO, Error>;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default AuthContext;
