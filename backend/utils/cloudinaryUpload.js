const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'donations',
        });
        // Remove file from local storage
        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        // Remove file from local storage even if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
};

module.exports = { uploadToCloudinary }; 