import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from './auth/AuthProvider';
import styles from '../styles/EditListing.module.css';

/**
 * EditListing is a React component that allows an admin user to edit the details of a product listing.
 * It fetches the product data from an API and pre-fills the form fields with the existing product information.
 * The component includes form handling for updating product details such as name, description, price, quantity, and image.
 *
 * @constant {Object} EditListing - The React component.
 * @returns {JSX.Element} JSX rendering the EditListing form.
 */
const EditListing = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user && !user.is_admin) {
            navigate('/');
        }

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/store/card/${id}`);
                const data = response.data;
                setProduct(data);
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setQuantity(data.quantity);
                setImagePreview(`http://localhost:8000${data.image_url}`);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('quantity', quantity);
            if (image) {
                formData.append('image', image);
            }

            await axios.put(`http://localhost:8000/cards/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            alert('Listing updated successfully!');
            navigate('/admin');

        } catch (err) {
            console.error('Error updating listing:', err);
            alert('Failed to update listing.');
        }
    };

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

    if (loading) return <div className={styles.loading}>Loading product details...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.editListingContainer}>
            <h1>Edit Listing</h1>

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
                        required
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
                    <label>Change Image</label>
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

                <button type="submit">Update Listing</button>
            </form>
        </div>
    );
};

export default EditListing;