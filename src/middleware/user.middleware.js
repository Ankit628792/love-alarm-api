const multer = require('multer');

// Configure the Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder where the uploaded files will be stored
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.filename + '-' + uniqueSuffix);
    }
});

// Create the Multer instance
const upload = multer({ storage });

module.exports = { upload };
