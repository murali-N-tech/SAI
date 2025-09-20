import multer from 'multer';

// Save files to a temporary directory on the server's disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './temp_uploads/') // Make sure this folder exists
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100 MB limit
    }
});