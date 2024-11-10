import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from './CartContext';
import { useAuthContext } from './auth/AuthProvider';
import styles from '../styles/NavBar.module.css';

/**
 * NavBar component that provides navigation links for the application.
 *
 * @param {Object} props - Props object.
 * @param {string|null} props.token - Authentication token.
 * @param {Function} props.setToken - Function to update the authentication token.
 *
 * @returns {JSX.Element} Rendered NavBar component.
 *
 * This component includes links to the Home, Store, Profile, Login, and Cart pages.
 * If a user is authenticated (i.e., a token exists), the Profile and Logout options
 * are displayed. Otherwise, the Login option is shown. It also displays the number
 * of items in the cart.
 *
 * The handleLogout function clears the user session, removes the token from storage,
 * and navigates the user to the login page.
 */
const NavBar = ({ token, setToken }) => {
    const { cartItems } = useCartContext();
    const { setUser } = useAuthContext();
    const navigate = useNavigate();


    const handleLogout = () => {

        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        sessionStorage.clear();
        // Remove any cookies if needed
        document.cookie.split(";").forEach(c => {
            document.cookie = c.trim().startsWith("token=") ? c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/" : "";
        });



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