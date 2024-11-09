import React, { createContext, useState, useContext } from "react";


/**
 * A context object created using React's createContext() function, used to manage
 * and share the state of a card component throughout the component tree in a React application.
 * This context helps in avoiding the prop drilling problem by providing a way to pass
 * data through the component tree without having to pass props down manually at every level.
 */
const CardContext = createContext();


/**
 * CardProvider is a context provider component that manages the state of cards and user information.
 * It provides the following functionalities:
 * - Adding a card
 * - Removing a card
 * - Logging in a user
 * - Logging out a user
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The child components to be rendered within this provider.
 *
 * @returns {JSX.Element} A context provider with state management for cards and user information.
 */
export const CardProvider = ({ children }) => {

    const [cards, setCards] = useState([]);
    const [user, setUser] = useState(null);


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


/**
 * Custom hook that provides access to the CardContext.
 *
 * This hook allows components to subscribe to the context values
 * provided by CardContext without needing to pass props directly.
 *
 * @function
 * @returns {Object} The current context value of CardContext.
 */
export const useCardContext = () => {
    return useContext(CardContext);
};