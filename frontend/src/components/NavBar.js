import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from './CartContext';  // Import the cart context

const NavBar = ({ token, setToken }) => {
    const { cartItems } = useCartContext();  // Access cartItems to display the number of items
    const navigate = useNavigate();

    // Handler for Logout
    const handleLogout = () => {
        setToken(null);  // Clear the authentication token
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/store">Store</Link></li>

                {/* Conditionally render Login or Profile */}
                {token ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}

                {/* Add a Shopping Cart link showing the number of items */}
                <li>
                    <Link to="/cart">
                        Cart ({cartItems.length})  {/* Display the number of items in the cart */}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;