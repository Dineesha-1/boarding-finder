import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Log the user out and go back to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = { display: 'block', marginBottom: 10 };

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h2>Home</h2>
      <p>Welcome, {user.name}!</p>
      <p>Your role: {user.role}</p>

      {/* Links everyone can see */}
      <Link to="/boardings" style={linkStyle}>
        Browse boardings
      </Link>

      {/* Link only owners can see */}
      {user.role === 'owner' && (
        <Link to="/owner" style={linkStyle}>
          Owner dashboard
        </Link>
      )}

      {/* Link only admins can see */}
      {user.role === 'admin' && (
        <Link to="/admin" style={linkStyle}>
          Admin: pending boardings
        </Link>
      )}

      <button onClick={handleLogout} style={{ padding: '8px 16px', marginTop: 10 }}>
        Logout
      </button>
    </div>
  );
}