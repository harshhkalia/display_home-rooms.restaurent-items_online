import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "homeimages/");
  },
  filename: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new Error("No file original name provided"));
    }
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});

const homeUploads = multer({ storage: storage });
export default homeUploads;
