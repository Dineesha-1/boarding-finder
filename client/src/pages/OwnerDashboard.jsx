import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api/boardings';

// Empty form values (used for adding and after saving)
const emptyForm = {
  title: '',
  description: '',
  price: '',
  address: '',
  gender: 'any',
  rooms: 1,
  distanceToUni: '',
  facilities: '',
};

export default function OwnerDashboard() {
  const { user } = useAuth();

  const [boardings, setBoardings] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  // The id of the boarding being edited (null means we are adding a new one)
  const [editingId, setEditingId] = useState(null);

  // Send the login token with every request
  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  // Load this owner's boardings from the backend
  const loadBoardings = async () => {
    const res = await axios.get(`${API}/mine`, authHeader);
    setBoardings(res.data);
  };

  useEffect(() => {
    loadBoardings();
  }, []);

  // Update one form field when the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fill the form with a boarding's values so it can be edited
  const startEdit = (b) => {
    setEditingId(b._id);
    setMessage('');
    setForm({
      title: b.title,
      description: b.description || '',
      price: b.price,
      address: b.address,
      gender: b.gender,
      rooms: b.rooms,
      distanceToUni: b.distanceToUni || '',
      facilities: (b.facilities || []).join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Leave edit mode and clear the form
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // Add a new boarding, or save changes to the one being edited
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const data = {
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      distanceToUni: form.distanceToUni ? Number(form.distanceToUni) : undefined,
      // "WiFi, Meals" becomes ['WiFi', 'Meals']
      facilities: form.facilities
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f),
    };
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, data, authHeader);
        setMessage('Boarding updated. It is waiting for admin approval again.');
      } else {
        await axios.post(API, data, authHeader);
        setMessage('Boarding added. It is waiting for admin approval.');
      }
      setEditingId(null);
      setForm(emptyForm);
      loadBoardings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save boarding');
    }
  };

  // Delete one of the owner's boardings
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this boarding?')) return;
    await axios.delete(`${API}/${id}`, authHeader);
    loadBoardings();
  };

  const input = { display: 'block', width: '100%', marginBottom: 10, padding: 8 };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: 20 }}>
      <h2>Owner Dashboard</h2>
      <p>
        <Link to="/home">Back to home</Link>
      </p>

      {/* Add / edit form */}
      <h3>{editingId ? 'Edit boarding' : 'Add a new boarding'}</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={input} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={input} />
        <input name="price" type="number" placeholder="Price per month" value={form.price} onChange={handleChange} required style={input} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required style={input} />
        <select name="gender" value={form.gender} onChange={handleChange} style={input}>
          <option value="any">Any gender</option>
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
        </select>
        <input name="rooms" type="number" min="1" placeholder="Rooms" value={form.rooms} onChange={handleChange} style={input} />
        <input name="distanceToUni" type="number" step="0.1" placeholder="Distance to university (km)" value={form.distanceToUni} onChange={handleChange} style={input} />
        <input name="facilities" placeholder="Facilities, separated by commas (WiFi, Meals)" value={form.facilities} onChange={handleChange} style={input} />
        <button type="submit" style={{ padding: '8px 16px', marginRight: 8 }}>
          {editingId ? 'Update boarding' : 'Add boarding'}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ padding: '8px 16px' }}>
            Cancel
          </button>
        )}
      </form>

      {/* The owner's boardings */}
      <h3 style={{ marginTop: 30 }}>My boardings</h3>
      {boardings.length === 0 && <p>You have not added any boardings yet.</p>}
      {boardings.map((b) => (
        <div key={b._id} style={{ border: '1px solid #666', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <strong>{b.title}</strong> | Rs. {b.price} | {b.address}
          <p style={{ margin: '6px 0' }}>Status: {b.status}</p>
          {b.status === 'rejected' && <p>Reason: {b.rejectionReason}</p>}
          <button onClick={() => startEdit(b)} style={{ marginRight: 8 }}>
            Edit
          </button>
          <button onClick={() => handleDelete(b._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}