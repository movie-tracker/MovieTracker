import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AuthProvider from "./context/AuthContext/AuthProvider";
import LoginPage from "./pages/Login";
import useAuthentication from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/theme-provider";
import Header from "@/components/header/Header";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      LoginPage,
    ],
  },
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
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Header />
            <Outlet />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

function MainApp() {
  return <RouterProvider router={router} />;
}

export default MainApp;
