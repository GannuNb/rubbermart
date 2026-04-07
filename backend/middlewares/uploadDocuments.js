// backend/middlewares/uploadDocuments.js

import multer from "multer";

const storage = multer.memoryStorage();

const uploadDocuments = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and PDF files are allowed"));
    }
  },
});

export default uploadDocuments;