import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page with this component to protect it.
// roles (optional): list of roles allowed to see the page, e.g. ['admin']
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // Not logged in: send the user to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but the role is not allowed: send the user to the home page
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  // Everything is fine: show the page
  return children;
}