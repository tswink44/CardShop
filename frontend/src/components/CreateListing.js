import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);  // Hold the image file
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image);  // Append image file

        try {
            // Post request to create card listing
            const response = await axios.post('http://localhost:8000/store/card/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Important to set multipart/form-data
                }
            });

            setMessage("Card listed successfully!");

            // Redirect to store page after creating the listing
            setTimeout(() => {
                navigate('/store');
            }, 1500);
        } catch (error) {
            setMessage("Failed to create card listing. Please try again.");
            console.error("There was an error creating the listing:", error);
        }
    };

    // Handle image file selection
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