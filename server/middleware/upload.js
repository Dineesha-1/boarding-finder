const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure the uploads folder exists
const folder = 'uploads';
if (!fs.existsSync(folder)) fs.mkdirSync(folder);

// Save files in the uploads folder with a unique name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folder),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

// Max 5 MB per photo
module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });