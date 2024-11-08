import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Store = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true); // To show loading state
    const [error, setError] = useState(null); // To handle errors, if any

    // Function to fetch cards from the backend API
    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:8000/store/cards');  // Adjust for your backend URL
            setCards(response.data);  // Set the fetched cards response into the state
            setLoading(false);  // Set loading to false once data is fetched
        } catch (err) {
            console.error("Error fetching cards", err);
            setError("Error fetching cards. Please try again later.");
            setLoading(false);
        }
    };

    // useEffect to trigger the fetchCards function on first render
    useEffect(() => {
        fetchCards();
    }, []);

    // Render loading state
    if (loading) return <div>Loading cards...</div>;

    // Render any errors
    if (error) return <div>{error}</div>;

    // Render cards when successfully fetched
    return (
        <div className="store-page">
            <h1>Cards Available in Store</h1>
            <div className="card-list">
                {cards.map(card => (
                    <div key={card.id} className="card-item">
                        <h2>{card.name}</h2>
                        <p>{card.description}</p>
                        <p>Price: ${card.price}</p>
                        <p>Quantity: {card.quantity}</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;