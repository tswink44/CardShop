import { useEffect, useState } from 'react';
import axios from 'axios';


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


    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) throw new Error("No refresh token available");


            const response = await axios.post("http://localhost:8000/token/refresh", { refresh_token: refreshToken });


            const newAccessToken = response.data.access_token;


            localStorage.setItem("access_token", newAccessToken);
            setToken(newAccessToken);

            return newAccessToken;
        } catch (error) {
            console.error("Error refreshing token", error);


            handleLogout();
        }
    };


    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

    };


    useEffect(() => {
        const checkTokenExpiration = () => {

        };


        const interval = setInterval(async () => {
            await refreshAccessToken();
        }, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        token,
        setToken,
        refreshAccessToken,
        handleLogout,
    };
};