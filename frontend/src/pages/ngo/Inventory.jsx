import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getInventory, deleteInventoryItem } from '../../services/ngoService';
import { toast } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';
import InventoryForm from './components/InventoryForm';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="text-center p-6 bg-red-50 rounded-lg">
            <h2 className="text-red-600 text-xl font-bold mb-4">Something went wrong:</h2>
            <pre className="text-red-500 mb-4">{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Try again
            </button>
        </div>
    );
};

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getInventory();
            setInventory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching inventory:', err);
            setError(err.message || 'Failed to load inventory');
            toast.error('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteInventoryItem(id);
            setInventory(prev => prev.filter(item => item._id !== id));
            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={fetchInventory}
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <FaPlus className="inline-block mr-2" />
                        Add Item
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(inventory || []).map(item => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-medium">{item.itemName}</h3>
                                    <p className="text-sm text-gray-400">
                                        Quantity: {item.quantity} {item.unit}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Category: {item.category}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {inventory.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No inventory items found
                    </div>
                )}

                {(isFormOpen || editingItem) && (
                    <InventoryForm
                        item={editingItem}
                        onClose={() => {
                            setIsFormOpen(false);
                            setEditingItem(null);
                        }}
                        onSubmit={() => {
                            fetchInventory();
                            setIsFormOpen(false);
                            setEditingItem(null);
                        }}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default Inventory;