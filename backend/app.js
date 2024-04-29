const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Book = require('./models/Book');

mongoose.connect('mongodb+srv://grimoire:MvGrimoire59@gaedique.ifdbh1k.mongodb.net/?retryWrites=true&w=majority&appName=Gaedique',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// - Authentification not required -

// POST - Register a new user
// POST - Login a registered user
// GET - Get all books (Array)
app.get('/api/stuff', (req, res, next) => {

});
// GET - Get a single book
// GET - Get the 3 best ratings books (Array)

// - Authentification required -

// POST - Post a new book
app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre Enregistré.' }))
    .catch(error => res.status(400).json({ error }));
});

// PUT - Post a new book
// DELETE - Delete a book
// POST - Rate a book

module.exports = app