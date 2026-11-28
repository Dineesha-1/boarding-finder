const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
// Let the browser open uploaded photos, e.g. /uploads/123.jpg
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('API is running'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/boardings', require('./routes/boardingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));