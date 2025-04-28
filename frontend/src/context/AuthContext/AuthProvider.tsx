import UserDTO from "@/services/dto/user.dto";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getProfile } from "../../services/user.service";
import { login as loginRequest } from "../../services/auth.service";
import AuthContext, { IAuthContext } from "./auth.context";

function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [authToken, setAuthToken] = useLocalStorage("authToken");
  const isAuthenticated = Boolean(authToken);

  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserDTO, Error>({
    queryKey: ["profile"],
    queryFn: async () => getProfile(),
    enabled: isAuthenticated,
  });

  async function login(username: string, password: string) {
    const { authToken: token } = await loginRequest(username, password);
    setAuthToken(token);
  }

  async function logout() {
    setAuthToken(null);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  const context: IAuthContext = {
    user: profileQuery.data,
    profileQuery,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
