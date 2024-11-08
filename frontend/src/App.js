import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from "./components/Register";
import Profile from "./components/Profile";
import {AuthProvider} from "./components/auth/AuthProvider";
import Store from "./components/Store";
import CreateListing from './components/CreateListing';

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
      <AuthProvider>
        <Router>
            {/* Add Navbar to display across all routes */}
            <NavBar setToken={setToken} token={token} />
            <div style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/create-listing" element={<CreateListing />} />
                </Routes>
            </div>
        </Router>
      </AuthProvider>
    );
};

export default App;