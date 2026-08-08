import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Biography from './pages/Biography';
import Gallery from './pages/Gallery';
import Guestbook from './pages/Guestbook';
import WishesWall from './pages/WishesWall';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="biography" element={<Biography />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="guestbook" element={<Guestbook />} />
                <Route path="wishes" element={<WishesWall />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
