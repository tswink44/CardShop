import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from './CartContext';
import styles from '../styles/NavBar.module.css'; // Import CSS module

/**
 * NavBar component that provides navigation links and user authentication controls.
 *
 * @param {Object} props - Component properties.
 * @param {string|null} props.token - Authentication token to determine the user's login status.
 * @param {function} props.setToken - Callback to update the authentication token state.
 * @returns {JSX.Element} The rendered NavBar component.
 */
const NavBar = ({ token, setToken }) => {
    const { cartItems } = useCartContext();
    const navigate = useNavigate();

    // Handler for Logout
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className={styles.navBar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/" className={styles.navLink}>Home</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/store" className={styles.navLink}>Store</Link>
                </li>
                {token ? (
                    <>
                        <li className={styles.navItem}>
                            <Link to="/profile" className={styles.navLink}>Profile</Link>
                        </li>
                        <li className={styles.navItem}>
                            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                        </li>
                    </>
                ) : (
                    <li className={styles.navItem}>
                        <Link to="/login" className={styles.navLink}>Login</Link>
                    </li>
                )}
                <li className={styles.navItem}>
                    <Link to="/cart" className={styles.navLink}>
                        Cart ({cartItems.length})
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;