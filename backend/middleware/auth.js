const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify that the token is valid and to transmit the information to other middleware or route managers
module.exports = (req, res, next) => {
    try {
        // Extract the token from the Authorization header (= Bearer + token) of the incoming request
        const token = req.headers.authorization.split(' ')[1]; // Split function to get the token after the space in the header
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // Verify method to decode our token
        const userId = decodedToken.userId; // Extract the user ID from our decoded token
        req.auth = { // Create the auth object and add it to the request so that our different routes can exploit it
            userId: userId // the field is the decoded token userId
        };
    next(); // transmits informations to the next middleware
    } catch(error) {
        res.status(401).json({ error }); // 401  Unauthorized = the request was not performed
    }
};