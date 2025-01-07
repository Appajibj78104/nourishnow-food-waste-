import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualization = () => {
    const globeEl = useRef();

    // Comprehensive data points for food waste and hunger globally
    const globalData = [
        // India
        {
            lat: 20.5937,
            lng: 78.9629,
            size: 0.8,
            color: '#EF4444', // Red for severe
            label: 'India: 40% food waste, 189M undernourished'
        },
        // China
        {
            lat: 35.8617,
            lng: 104.1954,
            size: 0.8,
            color: '#EF4444',
            label: 'China: 35% food waste, 149.3M undernourished'
        },
        // United States
        {
            lat: 37.0902,
            lng: -95.7129,
            size: 0.7,
            color: '#F59E0B', // Orange for high
            label: 'USA: 30-40% food waste, 35M food insecure'
        },
        // Brazil
        {
            lat: -14.2350,
            lng: -51.9253,
            size: 0.6,
            color: '#EF4444',
            label: 'Brazil: 30% food waste, 61.3M undernourished'
        },
        // Nigeria
        {
            lat: 9.0820,
            lng: 8.6753,
            size: 0.7,
            color: '#EF4444',
            label: 'Nigeria: 40% food waste, 25.6M undernourished'
        },
        // Indonesia
        {
            lat: -0.7893,
            lng: 113.9213,
            size: 0.6,
            color: '#EF4444',
            label: 'Indonesia: 300kg/person/year waste, 24.3M undernourished'
        },
        // European Union
        {
            lat: 50.8503,
            lng: 4.3517,
            size: 0.6,
            color: '#F59E0B',
            label: 'EU: 88M tonnes food waste annually'
        },
        // Russia
        {
            lat: 61.5240,
            lng: 105.3188,
            size: 0.5,
            color: '#F59E0B',
            label: 'Russia: 17M tonnes food waste annually'
        },
        // Sub-Saharan Africa
        {
            lat: -8.7832,
            lng: 34.5085,
            size: 0.7,
            color: '#EF4444',
            label: 'Sub-Saharan Africa: 237M undernourished'
        },
        // South Asia (excluding India)
        {
            lat: 28.0339,
            lng: 68.0739,
            size: 0.6,
            color: '#EF4444',
            label: 'South Asia: High food waste & malnutrition'
        }
    ];

    // Arc data for showing food waste flows
    const arcsData = [
        // Example food waste flows between regions
        {
            startLat: 37.0902,
            startLng: -95.7129,
            endLat: 20.5937,
            endLng: 78.9629,
            color: '#60A5FA'
        },
        {
            startLat: 50.8503,
            startLng: 4.3517,
            endLat: 9.0820,
            endLng: 8.6753,
            color: '#60A5FA'
        }
    ];

    useEffect(() => {
        if (globeEl.current) {
            // Initial animation
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            
            // Point to a central view
            globeEl.current.pointOfView({
                lat: 20,
                lng: 0,
                altitude: 2.5
            }, 1000);
        }
    }, []);

    return (
        <div className="h-[600px] w-full relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-2">Legend</h3>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <span className="text-white text-sm">Severe Crisis</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <span className="text-white text-sm">High Risk</span>
                </div>
            </div>
            
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                pointsData={globalData}
                pointColor="color"
                pointLabel="label"
                pointRadius="size"
                pointAltitude={0.1}
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={() => Math.random()}
                arcDashGap={() => Math.random()}
                arcDashAnimateTime={() => Math.random() * 4000 + 500}
                atmosphereColor="#60A5FA"
                atmosphereAltitude={0.25}
                width={800}
                height={600}
            />

            <div className="absolute bottom-4 right-4 z-10 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-white text-sm">
                    Data sources: UN FAO, World Food Programme, USDA
                </p>
            </div>
        </div>
    );
};

export default GlobeVisualization; 