import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUser, FaBox } from 'react-icons/fa';

const DonationMap = ({ donations = [] }) => {
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [radius, setRadius] = useState(10); // in kilometers

    const mapStyles = {
        height: "500px",
        width: "100%"
    };

    const defaultCenter = {
        lat: 20.5937,
        lng: 78.9629
    };

    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
            {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ffffff" }]
            },
            {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#000000" }, { lightness: 13 }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#1c1c1c" }]
            }
        ]
    };

    const onMarkerClick = useCallback((donation) => {
        setSelectedDonation(donation);
    }, []);

    const filterDonationsByDistance = useCallback((donations) => {
        // Filter donations based on radius
        // This is a simple implementation - you might want to use a more sophisticated distance calculation
        return donations.filter(donation => {
            if (!donation.location?.coordinates) return false;
            
            const lat1 = defaultCenter.lat;
            const lon1 = defaultCenter.lng;
            const lat2 = donation.location.coordinates[1];
            const lon2 = donation.location.coordinates[0];
            
            // Calculate distance using Haversine formula
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            return distance <= radius;
        });
    }, [radius]);

    const filteredDonations = filterDonationsByDistance(donations);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Donation Locations</h2>
                <div className="flex items-center space-x-4">
                    <label className="text-gray-300">Radius (km):</label>
                    <select
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={7}
                    center={defaultCenter}
                    options={mapOptions}
                >
                    {filteredDonations.map(donation => (
                        <Marker
                            key={donation._id}
                            position={{
                                lat: donation.location?.coordinates[1] || 0,
                                lng: donation.location?.coordinates[0] || 0
                            }}
                            onClick={() => onMarkerClick(donation)}
                            icon={{
                                url: '/marker-icon.png',
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                        />
                    ))}

                    {selectedDonation && (
                        <InfoWindow
                            position={{
                                lat: selectedDonation.location?.coordinates[1] || 0,
                                lng: selectedDonation.location?.coordinates[0] || 0
                            }}
                            onCloseClick={() => setSelectedDonation(null)}
                        >
                            <div className="bg-white p-3 rounded-lg shadow-lg max-w-xs">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    {selectedDonation.foodType}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p className="flex items-center">
                                        <FaBox className="mr-2" />
                                        Quantity: {selectedDonation.quantity} {selectedDonation.unit}
                                    </p>
                                    <p className="flex items-center">
                                        <FaUser className="mr-2" />
                                        Donor: {selectedDonation.donorName}
                                    </p>
                                    <p className="flex items-center">
                                        <FaMapMarkerAlt className="mr-2" />
                                        {selectedDonation.location?.address}
                                    </p>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </motion.div>
    );
};

export default DonationMap;