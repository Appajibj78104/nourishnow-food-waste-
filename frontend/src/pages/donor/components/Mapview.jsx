import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapView = ({ donations }) => {
    const [location, setLocation] = React.useState(null);

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    if (!location) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="h-64 rounded-lg overflow-hidden">
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={location}
                        zoom={15}
                    >
                        <Marker position={location} />
                        {donations.map(donation => (
                            donation.location && (
                                <Marker
                                    key={donation._id}
                                    position={donation.location}
                                    icon={{
                                        url: '/marker-icon.png',
                                        scaledSize: { width: 30, height: 30 }
                                    }}
                                />
                            )
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default MapView;
