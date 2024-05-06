const bcrypt = require('bcrypt'); // Encryption package
const jwt = require('jsonwebtoken'); // Package that create and verify tokens
const User = require('../models/User');
require('dotenv').config()

// POST - Register a new user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Hash the password, salt (execute) 10 times
        .then(hash => { // 
            const user = new User({ // Create a user with the mongoose model
                email: req.body.email,
                password: hash
            });
            user.save() // Register the encrypt password in the database
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // 201 Resource Creation
                .catch(error => res.status(400).json({ error })); // 400 Bad Request
        })
        .catch(error => res.status(500).json({ error })); // 500 Server Error
};

// POST - Login a registered user
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // findOne method to find a user in the database based on the email provided in the request body
        .then(user => { // Return a promise with 2 cases (1 & 2):
            if (user === null) { // 1- Check if a user exists in the database
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }); // 401 Unauthorized
            } else {
                bcrypt.compare(req.body.password, user.password) // 2- Check if the user pwd matches
                    .then(valid => { // Return a promise with 2 cases (a & b):
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }) // 401 Unauthorized
                        } else {
                            res.status(200).json({ // 200 Success
                                userId: user._id, // Returns an object necessary for request authentication : userId + token
                                token: jwt.sign( // Sign function to encrypt a new token with 3 arguments:
                                    { userId: user._id }, // - Payload: data to encode in the token -> Create an userId Object with the user._id of the user
                                    process.env.TOKEN_SECRET, // - Secret key to encode
                                    { expiresIn: process.env.EXPIRES_IN } // - Configure an expiration duration
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error }); // A) 500 - Processing error
                    })
            }
        })
        .catch(error => { //Error request in the database
            res.status(500).json({ error }); // 500 - Server Error
        })
};