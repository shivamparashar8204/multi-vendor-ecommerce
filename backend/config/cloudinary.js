import pkg from "cloudinary";
const { v2: cloudinary } = pkg;

export function isCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  return (
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    !CLOUDINARY_CLOUD_NAME.includes("YOUR")
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function destroyUpload(publicId, folder = "multivendor_uploads") {
  if (!isCloudinaryConfigured() || !publicId) return;
  await cloudinary.uploader.destroy(`${folder}/${publicId}`);
}

export default cloudinary;
