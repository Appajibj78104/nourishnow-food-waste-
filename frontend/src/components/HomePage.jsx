import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import GlobeVisualization from "./Globe";
import LoadingAnimation from "./LoadingAnimation";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingAnimation />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="min-h-screen bg-[#111827]"
      >
        {/* Hero Section with Parallax */}
        <div className="relative h-screen">
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#111827] z-10" />
            <img
              src="/images/hero-bg.jpg"
              alt="Food Donation"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Navigation */}
          <nav className="fixed w-full z-50 bg-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                >
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
                    NourishNow
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 md:gap-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                >
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm md:text-base"
                  >
                    Start now
                  </Link>
                </motion.div>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center px-4 z-20">
            <motion.div
              className="text-center max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Transform surplus into
                <span className="block text-blue-400">sustenance</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Join our mission to bridge the gap between food surplus and
                scarcity.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-all duration-300 inline-flex items-center space-x-2"
                  onClick={() => console.log("Start Donating clicked!")}
                >
                  <span>Start Donating</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <div className="w-[30px] h-[50px] rounded-full border-2 border-white p-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-auto"></div>
            </div>
          </motion.div>
        </div>

        {/* Image Grid Section */}
        <motion.section
          className="py-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="relative rounded-2xl overflow-hidden h-[400px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                  src="/images/volunteers.jpg"
                  alt="Volunteers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Join Our Community
                  </h3>
                  <p className="text-gray-200">
                    Make a difference in someone's life today
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="relative rounded-2xl overflow-hidden h-[400px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                  src="/images/donation.jpg"
                  alt="Food Donation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Easy Donation Process
                  </h3>
                  <p className="text-gray-200">
                    Simple steps to share your surplus food
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Globe Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Global Impact Visualization
            </h2>
            <GlobeVisualization />
          </div>
        </motion.section>

        {/* Impact Section with Background Image */}
        <motion.section
          className="py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 to-[#111827]/90 z-10" />
            <img
              src="/images/impact.jpg"
              alt="Impact"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Making a Real Impact
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Together, we've helped thousands of people access nutritious
                meals while reducing food waste in our communities.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          className="py-20 bg-white/5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                className="flex flex-col gap-4 rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <dt className="text-sm leading-6 text-gray-300">
                  Food Waste in India
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  <CountUp end={40} suffix="%" duration={2.5} />
                </dd>
              </motion.div>
              <motion.div
                className="flex flex-col gap-4 rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <dt className="text-sm leading-6 text-gray-300">
                  People Undernourished
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  <CountUp end={189} suffix="M" duration={2.5} />
                </dd>
              </motion.div>
              <motion.div
                className="flex flex-col gap-4 rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <dt className="text-sm leading-6 text-gray-300">
                  Meals Donated
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  <CountUp end={1000} suffix="+" duration={2.5} />
                </dd>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Community Section */}
        <motion.section
          className="py-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
              <img
                src="/images/community.jpg"
                alt="Community"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-2xl px-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Join Our Growing Community
                  </h2>
                  <p className="text-xl text-gray-200 mb-8">
                    Be part of a network that's making a difference every day.
                  </p>
                  <Link
                    to="/register"
                    className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    Get Started
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Feature cards with gradient borders */}
              <div className="relative rounded-2xl bg-gradient-to-r p-[1px] from-blue-500 to-teal-500">
                <div className="rounded-2xl bg-[#111827] p-8 h-full">
                  <div className="text-blue-400 mb-4">
                    <i className="fas fa-hand-holding-heart text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Easy Donation
                  </h3>
                  <p className="text-gray-400">
                    Seamless process to donate surplus food and make an
                    immediate impact.
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl bg-gradient-to-r p-[1px] from-teal-500 to-emerald-500">
                <div className="rounded-2xl bg-[#111827] p-8 h-full">
                  <div className="text-teal-400 mb-4">
                    <i className="fas fa-truck text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Quick Pickup
                  </h3>
                  <p className="text-gray-400">
                    Efficient collection service ensuring food reaches those in
                    need.
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl bg-gradient-to-r p-[1px] from-emerald-500 to-blue-500">
                <div className="rounded-2xl bg-[#111827] p-8 h-full">
                  <div className="text-emerald-400 mb-4">
                    <i className="fas fa-users text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Verified NGOs
                  </h3>
                  <p className="text-gray-400">
                    Partner with trusted organizations to maximize donation
                    impact.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto max-w-7xl px-6 mt-32 sm:mt-40 pb-20">
            <motion.div
              className="relative isolate rounded-3xl bg-gradient-to-r from-blue-500 to-teal-500 py-16 px-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to make a difference?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join our community of donors and help create a hunger-free
                world.
              </p>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
                >
                  Get started today
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>

      {/* Footer Section */}
      <footer className="bg-[#1F2937] text-gray-300 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-2">NourishNow</h3>
              <p className="text-sm">Transforming surplus into sustenance.</p>
            </div>
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Connect with Us</h3>
              <div className="flex space-x-4">
                <Link to="#" className="hover:text-blue-400 transition-colors"><i className="fab fa-facebook-f"></i></Link>
                <Link to="#" className="hover:text-blue-400 transition-colors"><i className="fab fa-twitter"></i></Link>
                <Link to="#" className="hover:text-blue-400 transition-colors"><i className="fab fa-instagram"></i></Link>
                <Link to="#" className="hover:text-blue-400 transition-colors"><i className="fab fa-linkedin-in"></i></Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm">© {new Date().getFullYear()} NourishNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
