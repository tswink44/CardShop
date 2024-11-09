import React, { createContext, useState, useContext } from "react";


/**
 * AppContext is a context object created using React's createContext method.
 * It is used to provide and consume data that is accessible throughout the
 * component tree without having to pass props down manually at every level.
 * This is particularly useful for managing global state or common data that
 * needs to be accessed by many components.
 */
const AppContext = createContext();


/**
 * AppProvider component is responsible for managing and providing the application's global
 * state using React's Context API. It includes state and functionality related to user
 * authentication, card management, and order management.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that consume the context.
 *
 * @returns {JSX.Element} The provider component with value attributes for state and functions.
 *
 * The context value provided includes:
 * - `cards` (Array): The current list of cards.
 * - `user` (Object|null): The current authenticated user, or null if no user is logged in.
 * - `orders` (Array): The current list of orders.
 * - `addCard` (function): Function to add a card to the list.
 * - `removeCard` (function): Function to remove a card from the list by its ID.
 * - `loginUser` (function): Function to log in a user.
 * - `logoutUser` (function): Function to log out the current user.
 * - `addOrder` (function): Function to add an order to the list.
 * - `removeOrder` (function): Function to remove an order from the list by its ID.
 */
export const AppProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);


    const addCard = (card) => {
        setCards((prevCards) => [...prevCards, card]);
    };


    const removeCard = (cardId) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    };


    const loginUser = (userDetails) => {
        setUser(userDetails);
    };


    const logoutUser = () => {
        setUser(null);
    };


    const addOrder = (order) => {
        setOrders((prevOrders) => [...prevOrders, order]);
    };


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

/**
 * A custom hook that provides access to the application context.
 *
 * @function
 * @returns {Object} The current context value from AppContext.
 *
 * This hook uses the React useContext hook to obtain and return the current value of the AppContext.
 * It simplifies accessing the context in functional components.
 */
export const useAppContext = () => {
    return useContext(AppContext);
};
