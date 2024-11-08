import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCartContext } from './CartContext';
import '../styles/Store.css';

const Store = () => {
    const [cards, setCards] = useState([]);  // Store the card data fetched from backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCartContext();  // Access the addToCart function from the cart context
    const [cartQuantities, setCartQuantities] = useState({});

    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:8000/store/cards');
            setCards(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cards', err);
            setError('Error fetching cards. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleAddToCart = (card, quantity) => {
        if (quantity > card.quantity) {
            alert(`Only ${card.quantity} item(s) of ${card.name} are in stock.`);
            return;
        }
        const newCard = { ...card, quantity };  // Add with the quantity selected
        addToCart(newCard);
    };

    const handleQuantityChange = (cardId, quantity) => {
        setCartQuantities((prevQuantities) => ({
            ...prevQuantities,
            [cardId]: quantity,
        }));
    };

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="store-page">
            <h1>Cards Available in Store</h1>
            <div className="card-list">
                {cards.map((card) => (
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
                        <p><strong>In Stock:</strong> {card.quantity}</p>

                        {/* Quantity input to determine how many to add to the cart */}
                        <input
                            type="number"
                            value={cartQuantities[card.id] || 1}  // Default quantity is 1
                            min="1"
                            max={card.quantity}  // Limit to in-stock
                            onChange={(e) => handleQuantityChange(card.id, parseInt(e.target.value))}
                        />
                        <button onClick={() => handleAddToCart(card, cartQuantities[card.id] || 1)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;