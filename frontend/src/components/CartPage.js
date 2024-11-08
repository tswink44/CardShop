import React from 'react';
import { useCartContext } from './CartContext';  // Import the cart context
import '../styles/CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, calculateTotal } = useCartContext();  // Access cart context

    return (
        <div>
            <h1>Your Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                <h2>{item.name}</h2>
                                <p>Price per item: ${item.price}</p>
                                <p>Quantity: {item.quantity} item(s)</p>
                                <p>Total for this item: ${(item.price * item.quantity).toFixed(2)}</p>  {/* Total for this item */}
                                <button onClick={() => removeFromCart(item.id)}>
                                    Remove from Cart
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Display subtotal */}
                    <h3>Subtotal: ${calculateTotal()}</h3>

                    <button onClick={() => alert('Proceeding to checkout...')}>Checkout</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;