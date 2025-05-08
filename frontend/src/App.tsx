import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

import Header from '@/components/header/Header';
import ThemeProvider from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import useAuthentication from '@/context/AuthContext';
import AuthProvider from '@/context/AuthContext/AuthProvider';
import DashboardPage from '@/pages/Dashboard';
import LoginPage from '@/pages/Login';

import './App.css';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      DashboardPage,
      LoginPage,
    ],
  },
]);

function Index() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/dashboard" />;
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
