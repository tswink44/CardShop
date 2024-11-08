import React, { createContext, useState, useContext } from "react";

// Create a context
const CardContext = createContext();

// Create a provider component
export const CardProvider = ({ children }) => {
    // Define your state here
    const [cards, setCards] = useState([]);
    const [user, setUser] = useState(null);

    // Functions to update state
    const addCard = (card) => {
        setCards((prevCards) => [...prevCards, card]);
    };

    const removeCard = (cardId) => {
        setCards((prevCards) => prevCards.filter(card => card.id !== cardId));
    };

    const loginUser = (user) => {
        setUser(user);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <CardContext.Provider
            value={{
                cards,
                user,
                addCard,
                removeCard,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </CardContext.Provider>
    );
};

// Custom hook to access context
export const useCardContext = () => {
    return useContext(CardContext);
};