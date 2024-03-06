import { v2 as cloudinary } from "cloudinary"; //configuring cloudinary for use in node.js app.

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
};

export default cloudinaryConfig;
