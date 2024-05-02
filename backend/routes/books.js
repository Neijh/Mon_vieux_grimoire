// Books routing logic

const express = require('express');
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/books');

const router = express.Router();


// - Authentification not required -

// GET - Get all books (Array)
// router.get('/', );
// GET - Get a single book
// GET - Get the 3 best ratings books (Array)

// - Authentification required -

router.post('/', auth, bookCtrl.createBook); // Post a new book

// PUT - Post a new book
// DELETE - Delete a book
// POST - Rate a book

module.exports = router;