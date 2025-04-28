import { useContext } from "react";
import AuthContext from "./auth.context";
import AuthProvider from "./AuthProvider";

export { AuthProvider };

function useAuthentication() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }
  return context;
}

export default useAuthentication;
