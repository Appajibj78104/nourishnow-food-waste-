import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';

const StatisticsAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('stats-section');
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    return (
        <section 
            id="stats-section" 
            className={`py-20 bg-gray-900 text-white opacity-0 transform translate-y-10 transition-all duration-1000 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">The Reality of Hunger in India</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Food Waste Statistic */}
                    <div className="p-6 bg-gray-800 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                            {isVisible && (
                                <CountUp end={40} suffix="%" duration={2.5} />
                            )}
                        </div>
                        <p className="text-gray-300">of food produced in India is wasted annually</p>
                        <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-[40%] animate-pulse"></div>
                        </div>
                    </div>

                    {/* Hunger Statistic */}
                    <div className="p-6 bg-gray-800 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-bold text-red-400 mb-2">
                            {isVisible && (
                                <CountUp end={189} suffix="M" duration={2.5} />
                            )}
                        </div>
                        <p className="text-gray-300">people are undernourished in India</p>
                        <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 w-[60%] animate-pulse"></div>
                        </div>
                    </div>

                    {/* Children Statistic */}
                    <div className="p-6 bg-gray-800 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">
                            {isVisible && (
                                <CountUp end={3500} duration={2.5} />
                            )}
                        </div>
                        <p className="text-gray-300">children die from malnutrition daily</p>
                        <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-[80%] animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatisticsAnimation; 