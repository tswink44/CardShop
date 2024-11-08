import React, { createContext, useContext } from 'react';
import { useAuth } from './useAuth'; // Import the custom hook we created

// Create the authentication context
const AuthContext = createContext(null);

// Use this hook to access auth state elsewhere in the application
export const useAuthContext = () => {
    return useContext(AuthContext);
};

// Provider component to wrap around the part of your app that needs authentication
export const AuthProvider = ({ children }) => {
    const auth = useAuth();  // Use the `useAuth` hook to get auth state and actions

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};