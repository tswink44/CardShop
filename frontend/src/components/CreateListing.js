import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';


/**
 * CreateListing is a React functional component that provides a form for users to create a new card listing.
 * Users can input the name, description, price, quantity, and an image of the card. On form submission,
 * the data is sent to the backend server via a POST request to create the listing. A success or failure message
 * is displayed based on the response from the server.
 *
 * State Variables:
 * - `name` (string): The name of the card.
 * - `description` (string): A brief description of the card.
 * - `price` (number): The price of the card.
 * - `quantity` (number): The number of cards available.
 * - `image` (File): The image file of the card.
 * - `message` (string): The success or failure message to display.
 *
 * Hooks:
 * - `useState`: Manages component state.
 * - `useNavigate`: Used to navigate to a different page after successful form submission.
 *
 * Functions:
 * - `handleSubmit`: Handles the form submission, sends the data to the server, and handles the response.
 * - `handleImageChange`: Updates the state with the selected image file.
 *
 * Returns:
 * - JSX to render the form and message.
 */
const CreateListing = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);  // Hold the image file
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:8000/store/card/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setMessage("Card listed successfully!");

            setTimeout(() => {
                navigate('/store');
            }, 1500);
        } catch (error) {
            setMessage("Failed to create card listing. Please try again.");
            console.error("There was an error creating the listing:", error);
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);  // Access the first selected file
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
                <div>
                    <label>Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required />  {/* Image input */}
                </div>
                <button type="submit">Create Listing</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateListing;