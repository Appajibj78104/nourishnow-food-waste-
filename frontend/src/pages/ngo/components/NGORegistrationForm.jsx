import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaIdCard, FaFileAlt, FaUpload, FaCheck } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

const NGORegistrationForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        email: '',
        phone: '',
        address: '',
        
        // Registration Details
        registrationNumber: '',
        darpanId: '',
        panNumber: '',
        
        // Capacity Details
        servingCapacity: '',
        operatingAreas: '',
        establishedYear: '',
        
        // Documents
        registrationCertificate: null,
        panCard: null,
        bankDetails: null
    });

    const [uploadProgress, setUploadProgress] = useState({
        registrationCertificate: 0,
        panCard: 0,
        bankDetails: 0
    });

    const { getRootProps: getRegCertProps, getInputProps: getRegCertInput } = useDropzone({
        accept: 'application/pdf,image/*',
        maxFiles: 1,
        onDrop: files => handleFileUpload('registrationCertificate', files[0])
    });

    const { getRootProps: getPanProps, getInputProps: getPanInput } = useDropzone({
        accept: 'application/pdf,image/*',
        maxFiles: 1,
        onDrop: files => handleFileUpload('panCard', files[0])
    });

    const { getRootProps: getBankProps, getInputProps: getBankInput } = useDropzone({
        accept: 'application/pdf,image/*',
        maxFiles: 1,
        onDrop: files => handleFileUpload('bankDetails', files[0])
    });

    const handleFileUpload = (type, file) => {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(prev => ({
                ...prev,
                [type]: progress
            }));
            if (progress >= 100) {
                clearInterval(interval);
                setFormData(prev => ({
                    ...prev,
                    [type]: file
                }));
            }
        }, 200);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                return formData.name && formData.email && formData.phone && formData.address;
            case 2:
                return formData.registrationNumber && formData.darpanId && formData.panNumber;
            case 3:
                return formData.servingCapacity && formData.operatingAreas && formData.establishedYear;
            default:
                return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 3) {
            if (validateStep(step)) {
                setStep(step + 1);
            }
        } else {
            // Submit form data
            try {
                // API call to register NGO
                navigate('/ngo/dashboard');
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                        {/* Basic Info Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Form fields for step 1 */}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Registration Details</h3>
                        {/* Registration Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Form fields for step 2 */}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Capacity & Documents</h3>
                        {/* Capacity Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Form fields for step 3 */}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#111827] relative">
            {/* Background with overlay */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#111827]/80 to-[#111827] z-10" />
                <img
                    src="/images/ngo-registration-bg.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Form Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        NGO Registration
                    </h1>
                    <p className="mt-2 text-gray-300">
                        Join our network of change-makers
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-center items-center space-x-4">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center border-2
                                    ${step > stepNumber 
                                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' 
                                        : step === stepNumber 
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-500'
                                            : 'border-gray-600 bg-gray-800/50 text-gray-500'}
                                `}>
                                    {step > stepNumber ? <FaCheck /> : stepNumber}
                                </div>
                                {stepNumber < 3 && (
                                    <div className={`w-20 h-1 mx-2 ${
                                        step > stepNumber ? 'bg-emerald-500/50' : 'bg-gray-600'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Organization Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Registration Details Fields */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            NGO Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            value={formData.registrationNumber}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            DARPAN ID
                                        </label>
                                        <input
                                            type="text"
                                            name="darpanId"
                                            value={formData.darpanId}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            PAN Number
                                        </label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Capacity & Documents Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Daily Serving Capacity
                                        </label>
                                        <input
                                            type="number"
                                            name="servingCapacity"
                                            value={formData.servingCapacity}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Operating Areas
                                        </label>
                                        <input
                                            type="text"
                                            name="operatingAreas"
                                            value={formData.operatingAreas}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Document Upload Section */}
                                <div className="space-y-4">
                                    <div {...getRegCertProps()} className="cursor-pointer">
                                        <div className="p-4 border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 transition-colors">
                                            <div className="flex items-center justify-center">
                                                <FaUpload className="text-gray-400 mr-2" />
                                                <span className="text-gray-300">Upload Registration Certificate</span>
                                            </div>
                                            {uploadProgress.registrationCertificate > 0 && (
                                                <div className="mt-2">
                                                    <div className="h-2 bg-white/10 rounded-full">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${uploadProgress.registrationCertificate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Similar upload sections for PAN Card and Bank Details */}
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 ml-auto"
                            >
                                {step === 3 ? 'Complete Registration' : 'Next Step'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default NGORegistrationForm; 