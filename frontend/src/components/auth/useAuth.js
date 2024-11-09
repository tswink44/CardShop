import { useEffect, useState } from 'react';
import axios from 'axios';

// Custom Hook for managing authentication tokens and refreshing them
/**
 * Hook that manages user authentication state and token refresh logic.
 *
 * This hook provides functionality for:
 * - Initializing the authentication token from local storage.
 * - Refreshing the access token using the refresh token.
 * - Logging out the user by clearing authentication tokens and states.
 * - Periodically checking and refreshing the token based on expiration logic.
 *
 * @returns {Object} An object containing:
 * - `token`: The current access token.
 * - `setToken`: A function to manually set the access token.
 * - `refreshAccessToken`: A function to refresh the access token using the refresh token.
 * - `handleLogout`: A function to handle user logout by clearing tokens and handling session expiration.
 */
export const useAuth = () => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));  // Initialize with persisted token, if available

    // Method to refresh the access token using the refresh token
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) throw new Error("No refresh token available");

            // Call the endpoint to refresh the token
            const response = await axios.post("http://localhost:8000/token/refresh", { refresh_token: refreshToken });

            // Update with the new token
            const newAccessToken = response.data.access_token;

            // Store the new token in Local Storage and update state
            localStorage.setItem("access_token", newAccessToken);
            setToken(newAccessToken);

            return newAccessToken; // Return the new token to be used by the caller
        } catch (error) {
            console.error("Error refreshing token", error);

            // If refresh token fails, handle logout (remove tokens, etc.)
            handleLogout();
        }
    };

    // Logout function: Clear tokens and redirect to login (if necessary)
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirect user or handle session expiration here (i.e., navigate to /login)
    };

    // Effect to check token expiration logic or periodically refresh
    useEffect(() => {
        const checkTokenExpiration = () => {
            // Optionally set logic to check if the token has expired and refresh it
            // For instance, you can check the JWT expiration field (exp) in the token
        };

        // You can use an interval to refresh the token before it expires
        const interval = setInterval(async () => {
            await refreshAccessToken();  // Refresh token periodically, e.g., every 10 minutes
        }, 10 * 60 * 1000);  // 10 minutes

        return () => clearInterval(interval); // Clean up interval on unmount
    }, []);

    return {
        token,
        setToken,
        refreshAccessToken,
        handleLogout,
    };
};