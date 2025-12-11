const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acorn-globus';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch((e)=> { console.error('Mongo connection error', e); process.exit(1); });

// Routes
app.use('/api/courts', require('./routes/courts'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
