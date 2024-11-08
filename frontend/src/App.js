import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from "./components/Register";

const App = () => {
    // Initialize token in the state and fetch from localStorage
    const [token, setToken] = useState(localStorage.getItem('token'));

    // This function updates token in both app state and localStorage
    const handleSetToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);  // Save token to localStorage
        } else {
            localStorage.removeItem('token');  // Clear token from localStorage
        }
    };

    return (
        <Router>
            {/* NavBar component, passing setToken to manage token updates */}
            <NavBar setToken={handleSetToken} token={token} />

            {/* Main content areas defined by Routes */}
            <div style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login setToken={handleSetToken} />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;