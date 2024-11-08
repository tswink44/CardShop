import React, { createContext, useState, useContext } from "react";

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [cards, setCards] = useState([]); // For cards available in the shop
    const [user, setUser] = useState(null); // For user details
    const [orders, setOrders] = useState([]); // For the user's orders

    // Add a card to the inventory
    const addCard = (card) => {
        setCards((prevCards) => [...prevCards, card]);
    };

    // Remove a card from the inventory
    const removeCard = (cardId) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    };

    // Log in a user
    const loginUser = (userDetails) => {
        setUser(userDetails);
    };

    // Log out a user
    const logoutUser = () => {
        setUser(null);
    };

    // Add an order
    const addOrder = (order) => {
        setOrders((prevOrders) => [...prevOrders, order]);
    };

    // Remove an order (if applicable)
    const removeOrder = (orderId) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    };

    return (
        <AppContext.Provider
            value={{
                cards,
                user,
                orders,
                addCard,
                removeCard,
                loginUser,
                logoutUser,
                addOrder,
                removeOrder,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to access context
export const useAppContext = () => {
    return useContext(AppContext);
};
