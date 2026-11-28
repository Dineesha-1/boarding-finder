import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Boardings() {
  // Data from the backend
  const [boardings, setBoardings] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Search and filter values
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    gender: '',
    sort: 'newest',
  });
  const [page, setPage] = useState(1);

  // Update one filter and go back to page 1
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  // Load boardings whenever the filters or the page change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Send only the filters that have a value
        const params = { page, limit: 6 };
        Object.keys(filters).forEach((key) => {
          if (filters[key]) params[key] = filters[key];
        });
        const res = await axios.get('http://localhost:5000/api/boardings', { params });
        setBoardings(res.data.boardings);
        setPages(res.data.pages);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, [filters, page]);

  const box = { padding: 8, marginRight: 8, marginBottom: 8 };

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 20 }}>
      <h2>Find a Boarding</h2>

      {/* Search and filters */}
      <div>
        <input
          name="search"
          placeholder="Search by name or address"
          value={filters.search}
          onChange={handleChange}
          style={box}
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={handleChange}
          style={{ ...box, width: 100 }}
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={handleChange}
          style={{ ...box, width: 100 }}
        />
        <select name="gender" value={filters.gender} onChange={handleChange} style={box}>
          <option value="">Any gender</option>
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
        </select>
        <select name="sort" value={filters.sort} onChange={handleChange} style={box}>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
        </select>
      </div>

      {/* Results */}
      {loading && <p>Loading...</p>}
      {!loading && boardings.length === 0 && <p>No boardings found.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {boardings.map((b) => (
          <div key={b._id} style={{ border: '1px solid #666', borderRadius: 8, padding: 14 }}>
                        {/* Cover photo: the first uploaded image */}
            {b.images?.length > 0 && (
              <img
                src={`http://localhost:5000${b.images[0]}`}
                alt={b.title}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
              />
            )}

            <h3 style={{ marginTop: 0 }}>
  <Link to={`/boardings/${b._id}`}>{b.title}</Link>
</h3>
            <p>{b.address}</p>
            <p>Rs. {b.price} / month</p>
            <p>
              For: {b.gender} | Rooms: {b.rooms}
            </p>
            {b.distanceToUni && <p>{b.distanceToUni} km from university</p>}
            <p>{b.isAvailable ? 'Available' : 'Full'}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 20 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span style={{ margin: '0 12px' }}>
          Page {page} of {pages || 1}
        </span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      <p style={{ marginTop: 20 }}>
        <Link to="/home">Back to home</Link>
      </p>
    </div>
  );
}