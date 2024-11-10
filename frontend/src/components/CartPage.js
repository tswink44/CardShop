import React from 'react';
import { useCartContext } from './CartContext';
import styles from '../styles/CartPage.module.css';

/**
 * @function CartPage
 *
 * Represents a component for displaying the user's shopping cart.
 *
 * Utilizes the cart context to render the current items in the cart,
 * display their details (such as name, price, quantity, and total price),
 * and provide functionality to remove items from the cart.
 *
 * Displays a message if the cart is empty.
 *
 * Also includes a subtotal calculation and a simulated checkout button.
 *
 * @returns {JSX.Element} The rendered cart page component.
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
                    <ul className={styles.cartList}>
                        {cartItems.map((item) => (
                            <li key={item.id} className={styles.cartListItem}>
                                <img src={`http://localhost:8000${item.image_url}`} alt={item.name}/> {/* Display image */}
                                <div className={styles.cartItemDetails}>
                                    <h2>{item.name}</h2>
                                    <p>Price per item: ${item.price}</p>
                                    <p>Quantity: {item.quantity} item(s)</p>
                                    <p>Total for this item:
                                        ${(item.price * item.quantity).toFixed(2)}</p>  {/* Total for this item */}
                                    <button onClick={() => removeFromCart(item.id)}>
                                        Remove from Cart
                                    </button>
                                </div>
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