import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api/admin/boardings';

export default function AdminBoardings() {
  const { user } = useAuth();
  const [boardings, setBoardings] = useState([]);

  // Send the login token with every request
  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  // Load boardings that are waiting for review
  const load = async () => {
    const res = await axios.get(`${API}/pending`, authHeader);
    setBoardings(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // Approve a boarding, then reload the list
  const approve = async (id) => {
    await axios.patch(`${API}/${id}/approve`, {}, authHeader);
    load();
  };

  // Reject a boarding with a reason typed by the admin
  const reject = async (id) => {
    const reason = window.prompt('Reason for rejection?');
    if (reason === null) return; // admin pressed Cancel
    await axios.patch(`${API}/${id}/reject`, { reason }, authHeader);
    load();
  };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: 20 }}>
      <h2>Admin: Pending Boardings</h2>
      <p>
        <Link to="/home">Back to home</Link>
      </p>

      {boardings.length === 0 && <p>No boardings are waiting for review.</p>}

      {boardings.map((b) => (
        <div key={b._id} style={{ border: '1px solid #666', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <strong>{b.title}</strong> | Rs. {b.price} | {b.address}
          <p style={{ margin: '6px 0' }}>
            For: {b.gender} | Rooms: {b.rooms}
            {b.facilities?.length > 0 && ` | ${b.facilities.join(', ')}`}
          </p>
          <p style={{ margin: '6px 0' }}>
            Owner: {b.owner?.name} ({b.owner?.email}, {b.owner?.phone})
          </p>
          <button onClick={() => approve(b._id)} style={{ marginRight: 8 }}>
            Approve
          </button>
          <button onClick={() => reject(b._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}