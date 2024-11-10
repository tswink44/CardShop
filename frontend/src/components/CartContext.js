import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Represents the context for managing a shopping cart within an application.
 *
 * The `CartContext` allows for state management and propagation of the cart's
 * contents and related actions throughout the component tree.
 *
 * Use the `CartContext` to provide and consume cart-related data and actions,
 * such as adding or removing items, and calculating totals, within your
 * components.
 *
 * This context is typically used with React's Context API.
 */
const CartContext = createContext();

/**
 * Custom hook to access the cart context.
 *
 * This hook provides access to the cart context, allowing components to consume
 * and manipulate cart data (like items, quantities, and total amounts).
 *
 * @returns {Object} The current context value of CartContext.
 */
export const useCartContext = () => useContext(CartContext);

/**
 * CartProvider component that manages the shopping cart state and provides functions to interact with the cart.
 * It uses the local storage to persist the state of the cart items.
 *
 * @param {object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the provider.
 * @returns {JSX.Element} The CartContext provider with its current state and actions.
 */
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });


    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

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

                return [...prevItems, { ...itemToAdd }];
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