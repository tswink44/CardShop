import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CardDetail = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);

    useEffect(() => {
        // Fetch card details from the FastAPI backend
        axios.get(`http://localhost:8000/cards/${id}`)
            .then(response => {
                setCard(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the card details:", error);
            });
    }, [id]);

    if (!card) return <div>Loading...</div>;

    return (
        <div>
            <h1>{card.name}</h1>
            <img src={card.image} alt={card.name} />
            <p>{card.description}</p>
            <button>Add to Cart</button>
        </div>
    );
};

export default CardDetail;
