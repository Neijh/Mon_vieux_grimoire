// File upload middleware
const multer = require('multer');

const MIME_TYPES = { // Mine Types dictionary
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({ // Configures path and file name for incoming files
    destination: (req, file, callback) => { // Designates in which folder save files
        callback(null, 'images'); // Register in the file 'images'
    },
    filename: (req, file, callback) => { // Give a name to the file
        const name = file.originalname.split(' ').join('_'); // Take the original name, remove the spaces and replaces them with underscrores
        const extension = MIME_TYPES[file.mimetype]; // Use Mime type to generate the file extension
        callback(null, name + Date.now() + '.' + extension); // Add a timestamp as well
    }
});

module.exports = multer({ storage }).single('image'); // single() creates middleware that captures files of a certain type