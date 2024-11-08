import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation

function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                email,
                password
            });

            if (response.data.token) {
                setToken(response.data.token);  // Save the token upon successful login.
                navigate('/');  // After successful login, redirect to home page.
            } else {
                setMessage("Login failed!");
            }
        } catch (error) {
            setMessage("An error occurred during login.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}

            {/* Link to redirect users to the registration page */}
            <p>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;