import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import React Router for navigation

const CreateListing = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();  // Used for navigation to the store or confirmation page

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Create the listing using the backend API
            const response = await axios.post('http://localhost:8000/store/card/', {
                name,
                description,
                price,
                quantity
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setMessage("Card listed successfully!");

            // Redirect to the store page or success page after creating the listing
            setTimeout(() => {
                navigate('/store');  // Route back to store page after successful creation
            }, 1500);

        } catch (error) {
            setMessage("Failed to create card listing. Please check the inputs and try again.");
            console.error("There was an error creating the listing:", error);
        }
    };

    return (
        <div>
            <h2>Create a New Card Listing</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0.01" step="0.01" required />
                </div>
                <div>
                    <label>Quantity</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required />
                </div>
                <button type="submit">Create Listing</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateListing;