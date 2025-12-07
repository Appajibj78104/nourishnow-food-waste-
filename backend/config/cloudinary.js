<<<<<<< HEAD
const { v2: cloudinary } = require('cloudinary');
=======
const cloudinary = require('cloudinary').v2;
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
