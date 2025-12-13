import { diskStorage }  from "multer";
import multer from "multer";
import path from "path"
import { v4 as uuid } from "uuid"

/*
    Video Naming 


*/

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // ✅ relative & safe
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const storedName = `${file.fieldname}-${uuid()}-${Date.now()}${ext}`;

    cb(null, storedName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
