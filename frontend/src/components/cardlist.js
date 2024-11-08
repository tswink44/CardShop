
import React, { useEffect, useState } from "react";
import axios from "../axios"; // Axios instance

function CardsList() {
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({ name: "", price: 0 });

    // Fetch all cards on component mount
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get("/cards");
                setCards(response.data);
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        };
        fetchCards();
    }, []);

    // Handle card form submit to add a new card
    const handleAddCard = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/cards", newCard);
            setCards([...cards, response.data]); // Add the new card to the state
            setNewCard({ name: "", price: 0 }); // Reset the form
        } catch (error) {
            console.error("Error adding card:", error);
        }
    };

    return (
        <div>
            <h2>Available Cards</h2>
            <ul>
                {cards.map((card) => (
                    <li key={card.id}>
                        {card.name} - ${card.price}
                    </li>
                ))}
            </ul>

            <h3>Add New Card</h3>
            <form onSubmit={handleAddCard}>
                <input
                    type="text"
                    placeholder="Card Name"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Card Price"
                    value={newCard.price}
                    onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
                />
                <button type="submit">Add Card</button>
            </form>
        </div>
    );
}

export default CardsList;
