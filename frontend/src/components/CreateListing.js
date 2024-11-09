import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreateListing.module.css';

const CreateListing = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);  // Image file state
    const [imagePreview, setImagePreview] = useState(null);  // For image preview
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        if (image) {
            formData.append('image', image);  // Add image if exists
        }

        try {
            const response = await axios.post('http://localhost:8000/store/card/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Card listed successfully!');

            // Redirect to store page after creating the listing
            setTimeout(() => {
                navigate('/store');
            }, 1500);
        } catch (error) {
            setMessage('Failed to create card listing. Please try again.');
            console.error('There was an error creating the listing:', error);
        }
    };

    // Handle image upload and preview
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);  // Set the selected image file

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);  // Set preview URL once image is read
            };
            reader.readAsDataURL(file);  // Read the file data
        } else {
            setImagePreview(null);  // Clear the preview if no image selected
        }
    };

    return (
        <div className={styles.createListingForm}>
            <h1>Create a New Listing</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min="1"
                        required
                    />
                </div>

                {/* Image Upload with Preview */}
                <div>
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className={styles.imagePreview}>
                        <img src={imagePreview} alt="Preview" width="200px" height="200px" />
                    </div>
                )}

                <button type="submit">Create Listing</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateListing;