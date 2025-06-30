import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

import ThemeProvider from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import useAuthentication from '@/context/AuthContext';
import AuthProvider from '@/context/AuthContext/AuthProvider';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register';
import IntroPage from '@/pages/IntroPage';
import HomePage from '@/pages/HomePage';
import MovieDetails from '@/pages/MovieDetails';
import MyMovies from '@/pages/MyMovies';

import './App.css';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Index() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to="/intro" replace />;
  }

  return <Navigate to="/home" replace />;
}

function Layout() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/intro',
        element: <IntroPage />,
      },
      {
        path: '/home',
        element: <ProtectedRoute><HomePage /></ProtectedRoute>,
      },
      {
        path: '/my-movies',
        element: <ProtectedRoute><MyMovies /></ProtectedRoute>,
      },
      {
        path: '/movie/:id',
        element: <ProtectedRoute><MovieDetails /></ProtectedRoute>,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;