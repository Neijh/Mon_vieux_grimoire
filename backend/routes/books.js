const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/books');

// - Authentification not required -

// POST - Register a new user
// POST - Login a registered user
// GET - Get all books (Array)
router.get('/', );
// GET - Get a single book
// GET - Get the 3 best ratings books (Array)

// - Authentification required -

// POST - Post a new book
router.post('/', );

// PUT - Post a new book
// DELETE - Delete a book
// POST - Rate a book

module.exports = router;