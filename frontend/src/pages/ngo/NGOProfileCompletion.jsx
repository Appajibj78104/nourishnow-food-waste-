import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateNGOProfile } from '../../services/ngoService';
import { toast } from 'react-toastify';

const NGOProfileCompletion = () => {
    const [formData, setFormData] = useState({
        registrationNumber: '',
        darpanId: '',
        panNumber: '',
        phone: '',
        address: '',
        establishedYear: '',
        servingCapacity: '',
        documents: {
            registrationCertificate: null,
            panCard: null,
            bankDetails: null
        }
    });

    // ... form handling code

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateNGOProfile(formData);
            toast.success('Profile completed successfully!');
            navigate('/ngo/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        }
    };

    // ... render form
}; 