import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from './auth/AuthProvider';
import '../styles/EditListing.css';

/**
 * The `EditListing` component allows authenticated users with admin privileges
 * to edit details of a product listing. It fetches the product data based on the
 * provided ID from the URL parameters and populates a form where users can
 * update the name, description, price, quantity, and image of the product.
 *
 * On form submission, the updated product details are sent to the server.
 *
 * @constant
 * @component
 * @returns {JSX.Element} JSX representation of the edit listing form.
 *
 * @throws Will throw an error if the product fails to load or update.
 */
const EditListing = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Form fields for editing product details
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);


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

            alert('Listing updated successfully');
            navigate('/admin');

        } catch (err) {
            console.error('Error updating listing:', err);
            alert('Failed to update listing.');
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    if (loading) return <div>Loading product details...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="edit-listing-container">
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
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>

                <button type="submit">Update Listing</button>
            </form>
        </div>
    );
};

export default EditListing;