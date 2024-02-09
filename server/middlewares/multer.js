import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  //   console.log("file", file);

  let extension = path.extname(file.originalname);
  console.log("extension", extension);

  if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png") {
    console.log("unacceptable file");
    cb(null, false);
  } else {
    console.log("file accepted");
    cb(null, true);
  }
};


const multerUpload = multer({ storage, fileFilter });

export default multerUpload;
