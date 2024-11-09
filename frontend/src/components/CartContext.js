import React, { createContext, useContext, useState } from 'react';

/**
 * CartContext is a React context for managing the state of a shopping cart
 * in an e-commerce application.
 *
 * This context provides functionalities such as adding items to the cart,
 * removing items from the cart, and updating the item quantities. It can be
 * used by consuming components to access and manipulate cart state.
 *
 * Usage of this context should be wrapped in a provider component that
 * initializes the state and provides the appropriate handlers for state
 * updates.
 *
 * @name CartContext
 * @type {React.Context}
 */
const CartContext = createContext();

/**
 * Custom hook that provides access to the cart context.
 *
 * This hook is used to access the cart information and actions
 * provided by the CartContext, allowing for the management and retrieval
 * of cart data within the application.
 *
 * @returns {Object} The current cart context value.
 */
export const useCartContext = () => useContext(CartContext);

/**
 * CartProvider is a React component that provides functionality for managing a shopping cart.
 * It uses React context to store and manipulate the cart state.
 *
 * This provider allows you to add items to the cart, remove items from the cart, and calculate
 * the total price of the cart items. It relies on the useState hook to manage an array of cart items,
 * each of which includes details like id, price, and quantity.
 *
 * The context value includes:
 * - `cartItems`: an array of items currently in the cart
 * - `addToCart`: a function to add an item to the cart or update its quantity if it already exists
 * - `removeFromCart`: a function to remove an item from the cart by its id
 * - `calculateTotal`: a function to compute the total price of all items in the cart
 *
 * @param {object} props - The properties passed to this component.
 * @param {React.ReactNode} props.children - The child components that this provider wraps around.
 *
 * @returns {React.ReactNode} The CartContext provider with all cart functionalities.
 */
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (itemToAdd) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === itemToAdd.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === itemToAdd.id
                        ? { ...item, quantity: item.quantity + itemToAdd.quantity }
                        : item
                );
            } else {
                return [...prevItems, itemToAdd];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};