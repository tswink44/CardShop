import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Prepare form URL-encoded data for the login request
            const formData = new FormData();
            formData.append('username', email);  // Backend expects 'username' field for email
            formData.append('password', password);

            // Make API call to FastAPI login endpoint
            const response = await axios.post('http://localhost:8000/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Log entire response for debugging purposes
            console.log("Response from login:", response.data);

            // Check if the access_token and refresh_token are present
            if (response.data.access_token && response.data.refresh_token) {
                // Save tokens in context and local storage
                setToken(response.data.access_token);  // Save access token in context or state
                localStorage.setItem('refresh_token', response.data.refresh_token);  // Save refresh token

                // Optionally, save token type (usually 'bearer')
                localStorage.setItem('token_type', response.data.token_type);

                // Redirect to profile page upon successful login
                navigate('/profile');
            } else {
                setMessage("Login failed! No tokens found.");
            }
        } catch (error) {
            // Handle any error that occurs during login
            setMessage("An error occurred during login.");
            console.error("Login error:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}

            {/* Link to redirect users to the registration page */}
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
    );
}

export default Login;