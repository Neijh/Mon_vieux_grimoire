// Books routing logic
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const bookCtrl = require('../controllers/books');



// Create
router.post('/', auth, multer, sharp, bookCtrl.createBook); // Post a new book
router.post('/:id/rating', auth, bookCtrl.rateBook) // Rate a book

// Read
router.get('/', bookCtrl.getAllBooks); // Get all books (Array)
router.get('/:id', bookCtrl.getOneBook); // GET - Get a single book
// GET - Get the 3 best ratings books (Array)
// Update
router.put('/:id', auth, multer, bookCtrl.modifyBook); // Modify a book
// Delete
router.delete('/:id', auth, bookCtrl.deleteBook); // Delete a book

module.exports = router;