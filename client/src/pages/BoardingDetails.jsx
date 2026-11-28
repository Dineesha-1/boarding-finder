import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function BoardingDetails() {
  // The id comes from the address, e.g. /boardings/123
  const { id } = useParams();
  const [boarding, setBoarding] = useState(null);
  const [error, setError] = useState('');

  // Load this boarding from the backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/boardings/${id}`);
        setBoarding(res.data);
      } catch (err) {
        setError('Boarding not found');
      }
    };
    load();
  }, [id]);

  if (error) return <p style={{ textAlign: 'center', marginTop: 60 }}>{error}</p>;
  if (!boarding) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '30px auto', padding: 20 }}>
      <h2>{boarding.title}</h2>
      <p>{boarding.description}</p>
      <p>Address: {boarding.address}</p>
      <p>Price: Rs. {boarding.price} / month</p>
      <p>
        For: {boarding.gender} | Rooms: {boarding.rooms}
      </p>
      {boarding.distanceToUni && <p>{boarding.distanceToUni} km from university</p>}
      <p>{boarding.isAvailable ? 'Available' : 'Full'}</p>

      {boarding.facilities?.length > 0 && (
        <p>Facilities: {boarding.facilities.join(', ')}</p>
      )}

      <h3>Contact the owner</h3>
      <p>Name: {boarding.owner?.name}</p>
      <p>Phone: {boarding.owner?.phone}</p>
      <p>Email: {boarding.owner?.email}</p>

      <p style={{ marginTop: 20 }}>
        <Link to="/boardings">Back to boardings</Link>
      </p>
    </div>
  );
}