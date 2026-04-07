export const uploadSellerDocumentsErrorHandler = (
  err,
  req,
  res,
  next
) => {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Please select files less than 1 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};