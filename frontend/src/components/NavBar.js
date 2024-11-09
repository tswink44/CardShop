import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from './CartContext';

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
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/store">Store</Link></li>


                {token ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}


                <li>
                    <Link to="/cart">
                        Cart ({cartItems.length})
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;