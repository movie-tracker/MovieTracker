import api from './api';

export async function getProfile() {
  const response = await api.get('/users/profile');
  return response.data;
}
