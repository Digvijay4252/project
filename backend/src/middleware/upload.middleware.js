const fs = require('fs');
const path = require('path');

const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'foods');
fs.mkdirSync(uploadDir, { recursive: true });

let multer;
try {
  multer = require('multer');
} catch (error) {
  multer = null;
}

const uploadFoodImage = multer
  ? multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '');
          cb(null, `${baseName}-${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 3 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image uploads are allowed'));
        }
        return cb(null, true);
      },
    })
  : {
      single: () => (req, res) =>
        res.status(503).json({
          success: false,
          message: 'File upload unavailable: install backend dependencies (multer missing)',
        }),
    };

module.exports = {
  uploadFoodImage,
};
