import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Form.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare form URL-encoded data
        const formData = new FormData();
        formData.append('username', email);  // The field is "username" in OAuth2PasswordRequestForm
        formData.append('password', password);

        try {
            // Axios request with form data (NOT JSON)
            const response = await axios.post('http://localhost:8000/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',  // Explicitly set Content-Type
                },
            });

            if (response.data.access_token) {
                setToken(response.data.access_token);  // Save the token in context or state
                navigate('/profile');  // Redirect to profile upon login success
            } else {
                setMessage("Login failed!");
            }
        } catch (error) {
            setMessage("An error occurred during login.");
            console.error("Login error: ", error.response?.data || error.message);
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
            <p>
                Don't have an account? <Link to="/register">Register here</Link>.
            </p>
        </div>
    );
};

export default Login;