import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the Auth context
const AuthContext = createContext();

// Custom hook to access the Auth context
export const useAuthContext = () => useContext(AuthContext);

// AuthProvider to wrap your app and provide the user state
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // User state
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const navigate = useNavigate();

    // Fetch the user data from the backend
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');  // Assuming token is stored in localStorage

            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('http://localhost:8000/me', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Attach the JWT token
                },
            });

            setUser(response.data);  // Set the user data
            setLoading(false);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');  // Clear token if invalid
            setLoading(false);  // Set loading to false, but leave user as `null`
            navigate('/login');  // Redirect to login if user is null or unauthorized
        }
    };

    // Fetch user when the component is mounted
    useEffect(() => {
        fetchUser();
    }, []);

    // Return null while loading
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};