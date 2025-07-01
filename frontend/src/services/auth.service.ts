import { httpClient } from './api';

export async function login(username: string, password: string) {
  const response = await httpClient.post<{ authToken: string }>('/auth/login', {
    username,
    password,
  });

  return response.data;
}
