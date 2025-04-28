import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AuthProvider from "./context/AuthContext/AuthProvider";
import LoginPage from "./pages/Login";
import useAuthentication from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  LoginPage,
]);

function Index() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <h1>Index Page</h1>;
}

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
