import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cpUploadMiddleware = upload.fields([{ name: "file", maxCount: 1 }]);

export default cpUploadMiddleware;
