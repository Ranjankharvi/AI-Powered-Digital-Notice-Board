// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const noticesRouter = require('./routes/notices');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// connect to mongodb
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_noticeboard';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connect error:', err));

app.use('/api/notices', noticesRouter);

// static uploads (optional)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
