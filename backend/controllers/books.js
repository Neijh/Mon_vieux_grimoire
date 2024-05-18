const Book = require('../models/Book');
const fs = require('fs'); // fs package exposes methods for interacting with the server's file system

// ********************* CREATE ************************
// Create a new book **************************************
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book) // The front end should send the request data as form-data and not as JSON
  delete bookObject._id; // Id is generated automatically by the database
  delete bookObject._userId; // Don't trust the user

  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // req.file.filename only contains the filename segment
    // req.protocol = first segment => http + ://
    // req.get('host') = 2nd segment => resolve server host
    // add '/images/' and the filename to complete the URL

  const book = new Book({ // Create the object
    ...bookObject, // bookObject (minus the 2 deleted fields)
    userId: req.auth.userId, // Extract the userId from the request object due to the middleware
    imageUrl: imageUrl
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre Enregistré.' })) // 201 Resource created
    .catch(error => res.status(400).json({ error })); // 400 Bad Request
};

// Rate a book **************************************
exports.rateBook = async (req, res, next) => {
  console.log("rateBook function called");
  try {
    // Define and retrieve userId and rate from the request body
    const userId = req.body.userId;
    const grade = req.body.rating;
    const book = await Book.findOne({ _id: req.params.id }); // Retrieve the object in database

    if (!book) { // Checks if the book exist
      return res.status(404).json({ message: 'Livre pas trouvé.' });
    }

    const isAlreadyRated = book.ratings.find(rating => rating.userId === userId);
    if (isAlreadyRated) { // The book can be rated only once by the user
      return res.status(401).json({ message: 'Vous ne pouvez attribuer qu\'une note par livre' });
    }

    if (grade < 0 || grade > 5) { // The rate mut be between 0 and 5
      return res.status(401).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }

    book.ratings.push({ userId, grade });

    // Calculate the average score
    const totalRatings = book.ratings.length;
    const totalRatingSum = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
    book.averageRating = totalRatingSum / totalRatings;
    book.averageRating = parseFloat(book.averageRating.toFixed(1));

    // Save the book
    await book.save();

    // Sending the whole object "book" as it is, including all its properties
    res.status(200).json(book);

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la notation' }); // 500 Server error
  }
};

// ********************* READ ************************
// Get all books (Array) **************************************
exports.getAllBooks = (req, res, next) => {
  Book.find().then( // Return all books
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Get a single book **************************************
exports.getOneBook = (req, res, next) => {
  Book.findOne({ // Return a single book
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Get 3 bestrating books **************************************
exports.bestratingBook = async (req, res, next) => {
  try {

    const books = await Book.find();

    // Sorts the array in descending order
    const sortedBooks = books.sort((a, b) => b.averageRating - a.averageRating);

    // Extract the first 3 books with the highest average ratings
    const bestBooks = sortedBooks.slice(0, 3);
        
    res.status(200).json(bestBooks);

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'affichage des trois meilleures notations' })
  }

};

// ********************* MODIFY ************************
// Modify a book **************************************
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? { // Is there a file field?
    ...JSON.parse(req.body.book), // If yes, process the new image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }; // if not, process the incoming object

  delete bookObject._userId; // Deleted the _userId field sent by the client to avoid changing its owner
  Book.findOne({ _id: req.params.id }) // Retrieve our object from the database
    .then((book) => { // Case 1:
      if (book.userId != req.auth.userId) { // If the user is not the authorized one:
        res.status(401).json({ message: 'Non autorisé' }); // 401 Unauthorized
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }) // Update the record, which one/which object
          .then(() => res.status(200).json({ message: 'Objet modifié!' })) // 200 Succès
          .catch(error => res.status(401).json({ error })); // 401 Unauthorized
      }
    })
    .catch((error) => { // Case 2:
      res.status(400).json({ error }); // 400 Bad Request
    });
};

// ********************* DELETE ************************
// Delete a book **************************************
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Retrieve the object in database
    .then(book => {
      if (book.userId != req.auth.userId) { // If the user is not the authorized one:
        res.status(401).json({ message: 'Non autorisé' }); // 401 Unauthorized
      } else {
        const filename = book.imageUrl.split('/images/')[1]; // Retrieved the url and recreated a file path from it
        fs.unlink(`images/${filename}`, () => { // unlink function to delete this file, passing it the file to delete
          Book.deleteOne({ _id: req.params.id }) // and the callback to execute once this file is deleted
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) }) // 200 Succès
            .catch(error => res.status(401).json({ error })); // 401 Unauthorized
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error }); // 500 Server Error
    });
};