import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCartContext } from './CartContext';  // Import the cart context

const Store = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCartContext();  // Access addToCart from CartContext

    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:8000/store/cards');
            setCards(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cards", err);
            setError("Error fetching cards. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="store-page">
            <h1>Cards Available in Store</h1>
            <div className="card-list">
                {cards.map(card => (
                    <div key={card.id} className="card-item">
                        <h2>{card.name}</h2>
                        <img
                            src={`http://localhost:8000${card.image_url}`}
                            alt={card.name}
                            width="200px"
                            height="200px"
                        />
                        <p>{card.description}</p>
                        <p><strong>Price:</strong> ${card.price}</p>
                        <p><strong>Quantity:</strong> {card.quantity}</p>
                        <button onClick={() => addToCart(card)}>Add to Cart</button> {/* Add to Cart button */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;