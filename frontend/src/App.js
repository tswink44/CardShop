import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/Global.css';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Store from './components/Store';
import Profile from './components/Profile';
import CartPage from './components/CartPage';  // Import CartPage
import { CartProvider } from './components/CartContext';
import CreateListing from "./components/CreateListing";
import CardDetail from "./components/CardDetail";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <CartProvider>  {/* Wrap the app with CartProvider for global access to the cart */}
            <Router>
                <NavBar token={token} setToken={setToken} />
                <div style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/store" element={<Store />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/create-listing" element={<CreateListing />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/card/:id" element={<CardDetail />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
};

export default App;