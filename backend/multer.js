import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { isCloudinaryConfigured } from "./config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function getPublicFileUrl(filename) {
  const baseUrl =
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/${filename}`;
}

class LocalDiskStorage {
  _handleFile(req, file, cb) {
    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    const filepath = path.join(uploadsDir, filename);
    const outStream = fs.createWriteStream(filepath);

    file.stream.pipe(outStream);
    outStream.on("error", cb);
    outStream.on("finish", () => {
      cb(null, {
        filename,
        path: getPublicFileUrl(filename),
      });
    });
  }

  _removeFile(req, file, cb) {
    fs.unlink(path.join(uploadsDir, file.filename), () => cb(null));
  }
}

let upload;

if (isCloudinaryConfigured()) {
  const { CloudinaryStorage } = await import("multer-storage-cloudinary");
  const cloudinary = (await import("./config/cloudinary.js")).default;
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "multivendor_uploads",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });
  upload = multer({ storage });
} else {
  console.log("Cloudinary not configured — using local uploads folder.");
  upload = multer({ storage: new LocalDiskStorage() });
}

export default upload;
