import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "restaurentUploads/");
  },
  filename: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new Error("No file original name provided"));
    }
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});

const upload = multer({ storage: storage });
export default upload;
