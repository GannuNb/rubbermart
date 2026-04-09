import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

export const uploadProductImages = upload.array("images", 3);