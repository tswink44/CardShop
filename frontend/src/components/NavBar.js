import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ setToken }) => {
    const [token, setLocalToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Update token state when the component mounts
        setLocalToken(localStorage.getItem('token'));
    }, [token]);

    const handleLoginLogout = () => {
        if (token) {
            // Logout functionality: remove token from localStorage
            localStorage.removeItem('token');
            setLocalToken(null);
        } else {
            // Redirect to login page or handle login modal
            // You can also trigger a login modal here if you want
            window.location.href = '/login'; // Example: Redirect to the login page
        }
    };

    return (
        <nav style={styles.navBar}>
            <div style={styles.navLinks}>
                <Link to="/" style={styles.navLink}>Home</Link>
                <Link to="/store" style={styles.navLink}>Store</Link>
            </div>
            <button onClick={handleLoginLogout} style={styles.loginButton}>
                {token ? 'Logout' : 'Login'}
            </button>
        </nav>
    );
};

const styles = {
    navBar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        border: 'none',
        padding: '10px 20px',
        color: 'white',
        cursor: 'pointer',
    },
};

export default NavBar;
