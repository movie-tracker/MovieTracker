import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import ThemeProvider from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import useAuthentication from '@/context/AuthContext';
import AuthProvider from '@/context/AuthContext/AuthProvider';
import Dashboard from '@/pages/Dashboard/Dashboard';
import FavoritesPage from '@/pages/Favorites';
import Login from '@/pages/Login/Login';
import WatchedPage from '@/pages/Watched';

import './App.css';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function Index() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/dashboard" />;
}

function Layout() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden sm:block w-64 bg-slate-800 text-white flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-0">
          <Outlet />
        </main>
      </div>
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
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/favorites',
        element: <ProtectedRoute><FavoritesPage /></ProtectedRoute>,
      },
      {
        path: '/watched',
        element: <ProtectedRoute><WatchedPage /></ProtectedRoute>,
      },
      {
        path: '/login',
        element: <Login />,
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
