import React from 'react';
import { useCartContext } from './CartContext';
import styles from '../styles/CartPage.module.css';

/**
 * CartPage component.
 *
 * Displays the cart items, total price, and provides functionality to remove items from the cart.
 * If the cart is empty, it displays a message indicating the cart is empty.
 *
 * @returns {JSX.Element} The CartPage component.
 */
const CartPage = () => {
    const { cartItems, removeFromCart, calculateTotal } = useCartContext();  // Access cart context

    return (
        <div className={styles.cartPage}>
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

                    <h3>Subtotal: ${calculateTotal()}</h3>

                    <button onClick={() => alert('Simulated Checkout..')}>Checkout</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;