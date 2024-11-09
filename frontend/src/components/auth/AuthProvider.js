import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the Auth context
/**
 * AuthContext is a React Context object created for managing
 * authentication state within an application. It provides a way
 * to pass authentication-related data and functions to
 * deeply nested components without having to explicitly pass props
 * down through every level of the component tree.
 *
 * Components wrapped in AuthProvider will have access to AuthContext,
 * enabling them to consume and manipulate authentication state.
 *
 * Usage typically involves creating an AuthProvider component
 * that houses the context state and related functions,
 * and wrapping the root component (or a part of the component tree)
 * with this provider.
 *
 * Example structure:
 *   createContext()
 */
const AuthContext = createContext();

// Custom hook to access the Auth context
/**
 * A custom hook that provides access to the authentication context.
 *
 * This hook is a shorthand for using the React `useContext` function
 * with the `AuthContext`. It allows components to easily access
 * authentication-related data and operations without directly
 * importing and using the context.
 *
 * @returns {Object} The current context value from `AuthContext`.
 */
export const useAuthContext = () => useContext(AuthContext);

// AuthProvider to wrap your app and provide the user state
/**
 * AuthProvider component is a context provider that handles user authentication.
 * It fetches the user data from the backend and manages the loading and error
 * states. If the user is not authenticated, it redirects to the login page.
 *
 * @param {Object} props - The properties passed to the AuthProvider component.
 * @param {ReactNode} props.children - The child components that need access to the authenticated user data.
 *
 * @returns {ReactNode} The children components wrapped within the AuthContext.Provider.
 */
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