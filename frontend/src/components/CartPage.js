import React from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from './CartContext';  // Import the cart context

const CartPage = () => {
    const { cartItems, removeFromCart, calculateTotal } = useCartContext();  // Access cart functions

    return (
        <div>
            <h1>Your Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/store">Go shopping</Link></p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                <h2>{item.name}</h2>
                                <p>Price: ${item.price}</p>
                                <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
                            </li>
                        ))}
                    </ul>

                    <h3>Subtotal: ${calculateTotal()}</h3>

                    <button onClick={() => alert('Proceeding to checkout (simulated)')}>Checkout</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;