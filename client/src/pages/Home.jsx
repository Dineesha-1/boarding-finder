import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Log the user out and go back to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h2>Home</h2>
      <p>Welcome, {user.name}!</p>
      <p>Your role: {user.role}</p>
      <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
        Logout
      </button>
    </div>
  );
}