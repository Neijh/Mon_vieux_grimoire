const sharp = require('sharp');

const resizeImage = async (req, res, next) => {
    if (!req.file) { // Check if a file was uploaded (Multer might skip creating the req.file property altogether if no file was uploaded in the request)
        return next(); // Ensures that code only executes when a file is actually present
    }
    try {
        const originalBuffer = req.file.buffer; // Get the original image buffer from Multer
        // Resize the image and convert it back to a buffer
        const resizedBuffer = await sharp(originalBuffer)
            .resize({ width: 463, height: 595, fit:'contain' })
            .toFormat('webp', { quality: 70 })
            // .webp({ quality:80 })
            .toBuffer(); // Produces a new buffer containing the modified image data
    
        // Replace the original buffer with the resized one
        originalBuffer = resizedBuffer;
    
        next();
    } catch (error) {
        console.error('Error resizing image:', error);
        next(error); // Pass error to error handling middleware
    }
}


module.exports = resizeImage;