import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { FaIdCard, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { setProfileCompleted } from '../utils/authUtils';

const DonorProfileForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Will be fetched from auth
    phone: '',
    aadharNumber: '',
    panNumber: '',
    address: '',
    latitude: '',
    longitude: '',
    documents: {
      aadhar: null,
      pan: null
    },
    profilePicture: null
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [autocomplete, setAutocomplete] = useState(null);
  const [previews, setPreviews] = useState({
    aadhar: null,
    pan: null,
    profile: null
  });

  // Document upload handlers using react-dropzone
  const { getRootProps: getAadharProps, getInputProps: getAadharInput } = useDropzone({
    accept: 'image/*,application/pdf',
    maxFiles: 1,
    onDrop: files => handleDocumentUpload('aadhar', files[0])
  });

  const { getRootProps: getPanProps, getInputProps: getPanInput } = useDropzone({
    accept: 'image/*,application/pdf',
    maxFiles: 1,
    onDrop: files => handleDocumentUpload('pan', files[0])
  });

  const { getRootProps: getProfileProps, getInputProps: getProfileInput } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: files => handleProfilePictureUpload(files[0])
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentUpload = (type, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file
      }
    }));
  };

  const handleProfilePictureUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: file
    }));
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setFormData(prev => ({
        ...prev,
        address: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
        if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
        break;
      // Add more validation cases as needed
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        try {
          // Submit form data to API
          await axios.post('/api/donor/profile', formData);
          completeProfile();
          setProfileCompleted();
          navigate('/donor/dashboard');
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      }
    }
  };

  const formSteps = [
    {
      title: "Basic Information",
      description: "Let's start with your basic details"
    },
    {
      title: "Identity Verification",
      description: "Upload your identity documents"
    },
    {
      title: "Contact & Location",
      description: "Help us reach you"
    }
  ];

  const renderIdentityVerification = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Aadhar Number
          </label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleInputChange}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="XXXX-XXXX-XXXX"
          />
          {errors.aadharNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.aadharNumber}</p>
          )}
          
          <div {...getAadharProps()} className="mt-4 border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
            <input {...getAadharInput()} />
            <FaIdCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-300">Upload Aadhar Card</p>
            {previews.aadhar && (
              <div className="mt-2">
                <img src={previews.aadhar} alt="Aadhar preview" className="h-20 mx-auto rounded" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            PAN Number
          </label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="XXXXXXXXXX"
          />
          {errors.panNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.panNumber}</p>
          )}
          
          <div {...getPanProps()} className="mt-4 border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
            <input {...getPanInput()} />
            <FaIdCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-300">Upload PAN Card</p>
            {previews.pan && (
              <div className="mt-2">
                <img src={previews.pan} alt="PAN preview" className="h-20 mx-auto rounded" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContactAndLocation = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div {...getProfileProps()} className="inline-block">
          <div className="relative w-32 h-32 mx-auto rounded-full border-2 border-dashed border-white/10 hover:border-white/30 transition-colors cursor-pointer overflow-hidden">
            <input {...getProfileInput()} />
            {previews.profile ? (
              <img src={previews.profile} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FaCamera className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-gray-300 mt-2">Upload Profile Picture</p>
        </div>
      </div>

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address
            </label>
            <Autocomplete
              onLoad={setAutocomplete}
              onPlaceChanged={handlePlaceSelect}
            >
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your address"
              />
            </Autocomplete>
          </div>

          {formData.latitude && formData.longitude && (
            <div className="h-64 rounded-xl overflow-hidden">
              <GoogleMap
                center={{ lat: formData.latitude, lng: formData.longitude }}
                zoom={15}
                mapContainerStyle={{ width: '100%', height: '100%' }}
              >
                {/* Add marker for selected location */}
              </GoogleMap>
            </div>
          )}
        </div>
      </LoadScript>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#111827] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl overflow-hidden border border-white/10">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border-b border-white/10 p-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Complete Your Donor Profile
          </h2>
          <p className="text-gray-400 text-center mt-2">
            {formSteps[step - 1].description}
          </p>
          
          {/* Step Indicators */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            {formSteps.map((formStep, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${step > index + 1 ? 'border-emerald-500 bg-emerald-500/20' : 
                    step === index + 1 ? 'border-blue-500 bg-blue-500/20' : 
                    'border-white/10 bg-white/5'}
                `}>
                  {step > index + 1 ? (
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-sm ${step === index + 1 ? 'text-blue-400' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 ${step > index + 1 ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Identity Verification */}
            {step === 2 && renderIdentityVerification()}

            {/* Step 3: Contact & Location */}
            {step === 3 && renderContactAndLocation()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#111827] ml-auto"
              >
                {step === 3 ? 'Complete Profile' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default DonorProfileForm;