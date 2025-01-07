import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const GlobeVisualization = () => {
    const globeEl = useRef();

    // Global data points for major countries
    const globalData = [
        // India (main focus)
        {
            lat: 20.5937,
            lng: 78.9629,
            size: 1.2,
            color: '#EF4444',
            label: 'India: 40% food waste, 189M undernourished'
        },
        // China
        {
            lat: 35.8617,
            lng: 104.1954,
            size: 0.8,
            color: '#F59E0B',
            label: 'China: 35% food waste'
        },
        // United States
        {
            lat: 37.0902,
            lng: -95.7129,
            size: 0.8,
            color: '#F59E0B',
            label: 'USA: 30-40% food waste'
        },
        // Brazil
        {
            lat: -14.2350,
            lng: -51.9253,
            size: 0.8,
            color: '#EF4444',
            label: 'Brazil: 30% food waste'
        },
        // Nigeria
        {
            lat: 9.0820,
            lng: 8.6753,
            size: 0.8,
            color: '#EF4444',
            label: 'Nigeria: 40% food waste'
        }
    ];

    // India's detailed polygon coordinates
    const indiaPolygon = {
        coordinates: [[[
            [77.0, 35.0],     // Kashmir
            [80.0, 35.0],     // Northern border
            [89.0, 28.0],     // Northeast
            [97.0, 28.0],     // Eastern border
            [94.0, 15.0],     // Southeast
            [80.0, 8.0],      // Southern tip
            [77.0, 8.0],      // Southern region
            [70.0, 20.0],     // Southwest
            [68.0, 27.0],     // Western border
            [77.0, 35.0]      // Back to Kashmir
        ]]]
    };

    useEffect(() => {
        if (globeEl.current) {
            // Initial position focusing on India
            globeEl.current.pointOfView({
                lat: 20.5937,
                lng: 78.9629,
                altitude: 2.5
            }, 1000);

            // Enable auto-rotation
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            
            // Adjust camera settings
            globeEl.current.controls().enableZoom = true;
            globeEl.current.controls().maxDistance = 500;
            globeEl.current.controls().minDistance = 100;
        }
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-4">
            {/* Globe Container */}
            <div className="relative h-[600px] w-full">
                {/* Legend */}
                <div className="absolute top-4 left-4 z-10 bg-black/70 p-4 rounded-lg backdrop-blur-md border border-white/20">
                    <h3 className="text-white font-semibold mb-3">Food Waste Crisis</h3>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-4 h-4 rounded-full bg-[#EF4444] shadow-lg shadow-red-500/50"></div>
                        <span className="text-white text-sm">Severe ({'>'}35%)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-[#F59E0B] shadow-lg shadow-amber-500/50"></div>
                        <span className="text-white text-sm">High (25-35%)</span>
                    </div>
                </div>

                <Globe
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    pointsData={globalData}
                    pointColor="color"
                    pointLabel="label"
                    pointRadius="size"
                    pointAltitude={0.01}
                    pointResolution={2}
                    polygonsData={[indiaPolygon]}
                    polygonCapColor={() => 'rgba(200, 100, 0, 0.2)'}
                    polygonSideColor={() => 'rgba(200, 100, 0, 0.7)'}
                    polygonStrokeColor={() => '#ffffff'}
                    polygonAltitude={0.05}
                    atmosphereColor="#ffffff"
                    atmosphereAltitude={0.15}
                    width={600}
                    height={600}
                />
            </div>

            {/* Statistics Section */}
            <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/10"
                >
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">
                        Global Food Waste Crisis
                    </h2>

                    {/* Food Waste Statistics */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-white">Global Annual Food Waste</span>
                            <span className="text-emerald-400">
                                <CountUp
                                    start={0}
                                    end={1.3}
                                    duration={2}
                                    decimals={1}
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                                {' '}Billion Tonnes
                            </span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "70%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                            />
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            <CountUp
                                start={0}
                                end={33}
                                duration={2}
                                enableScrollSpy
                                scrollSpyOnce
                            />
                            % of all food produced globally goes to waste
                        </p>
                    </div>

                    {/* Regional Statistics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                            <h3 className="text-gray-400 text-sm">India's Rank</h3>
                            <p className="text-3xl font-bold text-white mt-2">
                                <CountUp
                                    start={0}
                                    end={1}
                                    duration={2}
                                    prefix="#"
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                            </p>
                            <p className="text-red-400 text-sm mt-1">In Food Waste</p>
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                            <h3 className="text-gray-400 text-sm">Economic Impact</h3>
                            <p className="text-3xl font-bold text-white mt-2">
                                <CountUp
                                    start={0}
                                    end={1}
                                    duration={2}
                                    prefix="$"
                                    suffix="T"
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                            </p>
                            <p className="text-emerald-400 text-sm mt-1">Annual Loss</p>
                        </div>
                    </div>

                    {/* Top Countries List */}
                    <div className="space-y-3">
                        <h3 className="text-white font-semibold">Top Contributing Countries</h3>
                        <div className="space-y-2">
                            {['India', 'China', 'USA', 'Brazil', 'Nigeria'].map((country, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                    <span className="text-gray-300">{country}</span>
                                    <span className="text-emerald-400">
                                        <CountUp
                                            start={0}
                                            end={[40, 35, 30, 30, 40][index]}
                                            duration={2}
                                            suffix="%"
                                            enableScrollSpy
                                            scrollSpyOnce
                                        />
                                        {' '}waste
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Source Citation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-400 text-right"
                >
                    Data sources: UN FAO, World Food Programme, UNEP Food Waste Index
                </motion.div>
            </motion.div>
        </div>
    );
};

export default GlobeVisualization;