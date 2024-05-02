const Book = require('../models/Book')

// - Authentification not required -

// GET - Get all books (Array)
exports.getBook = (req, res, next) => {

};

// GET - Get a single book
// GET - Get the 3 best ratings books (Array)

// - Authentification required -

// POST - Post a new book
exports.createBook = (req, res, next) => {
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    Book.save()
      .then(() => res.status(201).json({ message: 'Livre Enregistré.' }))
      .catch(error => res.status(400).json({ error }));
  };

// PUT - Post a new book
// DELETE - Delete a book
// POST - Rate a book