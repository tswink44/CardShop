import React, { createContext, useContext, useState } from 'react';

// Create Cart Context
const CartContext = createContext();

// Hook to use cart context in components
export const useCartContext = () => useContext(CartContext);

// Provide cart state globally
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add an item to the cart
    const addToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    // Function to remove an item from the cart
    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    // Calculate the cart subtotal based on item prices and quantities
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);  // price * quantity per item type
        }, 0).toFixed(2);  // Keep 2 decimal points
    };

    // The cart context value that will be accessible to all components
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};