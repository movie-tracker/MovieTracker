import api from "./api";

export async function login(username: string, password: string) {
  const response = await api.post<{ authToken: string }>("/auth/login", {
    username,
    password,
  });

  return response.data;
}
