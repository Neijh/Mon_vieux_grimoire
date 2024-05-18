const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Import routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// Load environment variables in process.env object
mongoose.connect(process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Set up Express framework
const app = express();

app.use((req, res, next) => { // To enable cross-origin requests (and prevent CORS errors), specific access control headers are specified for all response objects
  res.setHeader('Access-Control-Allow-Origin', '*'); // Access our API from any origin
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Add the mentioned headers to requests sent to the API
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Send requests with the mentioned methods
  next();
});

app.use(express.json()); // Parse JSON data in incoming requests

// Register routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // Handle requests to the /images route, by making our images folder static (a subdirectory of our base directory, __dirname)

module.exports = app;