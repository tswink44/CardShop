import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);  // Prevent multiple submissions while request is being processed
        try {
            const response = await axios.post('http://localhost:8000/users/', {
                username,
                email,
                password
            });

            if (response.status === 201) {
                setMessage("User registered successfully!");
                setTimeout(() => {
                    navigate('/login');  // Redirect user to login page after 1.5 seconds
                }, 1500);
            } else {
                setMessage(`Registration failed: ${response.data.message}`);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data.detail)) {
                    setMessage(error.response.data.detail.map(e => e.msg).join(", "));
                } else {
                    setMessage(`Error: ${error.response.data.detail}`);
                }
            } else {
                setMessage("An unexpected error occurred during registration!");
            }
        } finally {
            setIsSubmitting(false);  // Re-enable form submission
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" aria-label="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" aria-label="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" aria-label="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={isSubmitting}>Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;