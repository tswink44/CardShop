import React, { createContext, useContext, useState } from 'react';

// Create Cart Context
const CartContext = createContext();

// Hook to use cart context in components
export const useCartContext = () => useContext(CartContext);

// Provide cart state globally
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add an item to the cart
    const addToCart = (itemToAdd) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === itemToAdd.id);

            if (existingItem) {
                // If the item already exists in the cart, update the quantity
                return prevItems.map(item =>
                    item.id === itemToAdd.id
                        ? { ...item, quantity: item.quantity + itemToAdd.quantity }
                        : item
                );
            } else {
                // If it's a new item, add it to the cart
                return [...prevItems, itemToAdd];
            }
        });
    };

    // Function to remove an item from the cart
    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    // Calculate the total based on the quantity and price of items
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};