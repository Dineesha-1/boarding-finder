import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // All form values are kept in one object
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  // Update one field of the form when the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setError('');
    try {
      await register(form);
      navigate('/home'); // go to the home page after registering
    } catch (err) {
      // Show the message sent by the backend, or a default one
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const inputStyle = { display: 'block', width: '100%', marginBottom: 12, padding: 8 };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 20 }}>
      <h2>Register</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Choose the type of account */}
        <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
          <option value="student">Student</option>
          <option value="owner">Boarding owner</option>
        </select>

        <button type="submit" style={{ padding: '8px 16px' }}>
          Register
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}