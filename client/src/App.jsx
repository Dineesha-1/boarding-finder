import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Boardings from './pages/Boardings';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminBoardings from './pages/AdminBoardings';

export default function App() {
  return (
    <Routes>
      {/* Public pages: anyone can see these */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/boardings" element={<Boardings />} />

      {/* Protected page: only logged-in users can see this */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Owner only: boarding dashboard */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute roles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
            {/* Admin only: approve or reject boardings */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminBoardings />
          </ProtectedRoute>
        }
      />

      {/* Any other address goes to the login page */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}