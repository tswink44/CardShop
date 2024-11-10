import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreateListing.module.css';

/**
 * CreateListing is a functional React component that renders a form allowing
 * users to create a new product listing. The form includes fields for the product's
 * name, description, price, quantity, and an image upload feature. Upon submission,
 * the form data is sent to the server to create a new product listing.
 *
 * Internal state is managed using the useState hook for each form field and image
 * preview functionality. The useNavigate hook is used for redirecting after a
 * successful listing creation.
 *
 * @component
 * @returns {JSX.Element} A form for creating a new product listing.
 */
const CreateListing = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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
            formData.append('image', image);
        }

        try {
            const response = await axios.post('http://localhost:8000/store/card/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Card listed successfully!');


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
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
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

                <div>
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

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