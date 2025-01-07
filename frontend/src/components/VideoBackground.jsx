import React from 'react';

const VideoBackground = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <video
                autoPlay
                loop
                muted
                className="absolute min-w-full min-h-full object-cover opacity-40"
                style={{ filter: 'brightness(0.4)' }}
            >
                <source 
                    src="/videos/food-donation.mp4" 
                    type="video/mp4" 
                />
            </video>
        </div>
    );
};

export default VideoBackground; 