import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VolunteerManager = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVolunteer, setEditingVolunteer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        availability: [],
        skills: [],
        area: ''
    });

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const response = await fetch('/api/ngo/volunteers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            toast.error('Failed to fetch volunteers');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingVolunteer 
                ? `/api/ngo/volunteers/${editingVolunteer._id}`
                : '/api/ngo/volunteers';
            
            const method = editingVolunteer ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(editingVolunteer ? 'Volunteer updated' : 'Volunteer added');
                fetchVolunteers();
                resetForm();
            }
        } catch (error) {
            toast.error('Failed to save volunteer');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            availability: [],
            skills: [],
            area: ''
        });
        setEditingVolunteer(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Volunteer Management</h2>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    <FaUserPlus />
                    <span>Add Volunteer</span>
                </button>
            </div>

            {/* Volunteer List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteers.map(volunteer => (
                    <motion.div
                        key={volunteer._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{volunteer.name}</h3>
                                <p className="text-gray-400">{volunteer.email}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setEditingVolunteer(volunteer);
                                        setFormData(volunteer);
                                        setIsFormOpen(true);
                                    }}
                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(volunteer._id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-400">
                                <span className="font-semibold">Phone:</span> {volunteer.phone}
                            </p>
                            <p className="text-sm text-gray-400">
                                <span className="font-semibold">Area:</span> {volunteer.area}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {volunteer.skills.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Volunteer Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Form fields */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                                />
                                {/* Add other form fields */}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 rounded-lg bg-gray-700 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                                >
                                    {editingVolunteer ? 'Update' : 'Add'} Volunteer
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default VolunteerManager;