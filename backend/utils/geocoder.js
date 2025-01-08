const NodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');

dotenv.config();

const options = {
    provider: process.env.GEOCODER_PROVIDER || 'google',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

 const getCoordinates = async (address) => {
    try {
        const results = await geocoder.geocode(address);
        if (results && results[0]) {
            return {
                type: 'Point',
                coordinates: [results[0].longitude, results[0].latitude]
            };
        }
        throw new Error('Location not found');
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
};

 const getAddress = async (coordinates) => {
    try {
        const results = await geocoder.reverse({
            lat: coordinates[1],
            lon: coordinates[0]
        });
        return results[0];
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw error;
    }
}; 
module.exports = { getCoordinates, getAddress };