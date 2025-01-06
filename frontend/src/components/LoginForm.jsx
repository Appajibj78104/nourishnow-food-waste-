import React, { useState } from 'react';
import { login } from '../services/authService';

const LoginForm = () => {
    const [error, setError] = useState(null); // Holds error as a string or null

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const data = await login(email, password);
            console.log('Login successful:', data);
        } catch (err) {
            // Check if the error response has a meaningful message
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage); // Set error as a string
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            {/* Render the error only if it's a string */}
            {error && <p className="error">{String(error)}</p>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
