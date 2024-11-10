import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';

/**
 * Register component allows users to create an account by providing a username, email, and password.
 * Handles user input, form submission, and displays messages based on the registration process outcome.
 * Utilizes `useState` for managing form state and `useNavigate` for redirecting post-registration.
 *
 * @return {JSX.Element} The Register component.
 */
function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/users/', {
                username,
                email,
                password
            });

            if (response.status === 201) {
                setMessage("User registered successfully!");
                setTimeout(() => {
                    navigate('/login');
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
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Username</label>
                    <input
                        type="text"
                        aria-label="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        aria-label="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        aria-label="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} className={styles.button}>Register</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

export default Register;