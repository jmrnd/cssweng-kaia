const multer = require('multer');
const moment = require('moment');
const path = require('path');

// Define a function to check if a file is an image
const imageFilter = (req, file, cb) => {
    if( file.mimetype.startsWith('image/') ) {
      cb( null, true ); // Accept the file
    } else {
      cb( new Error('Only image files are allowed.'), false ); // Reject the file
    }
  };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if( file.fieldname === 'product' ) {
            cb( null, 'public/upload/products' );
        } else {
            cb( null, 'public/upload' );
        }
    },
    filename: (req, file, cb) => {
        const date = moment().format('YYYY-MM-DD-HHmmss');
        const name = file.originalname;
        const fileName = `${date}-${name}`;
        cb( null, fileName );
    }
});

const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});
module.exports = upload;