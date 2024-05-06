const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

// Register routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // Handle requests to the /image route, by making our images folder static (a subdirectory of our base directory, __dirname)

module.exports = app;