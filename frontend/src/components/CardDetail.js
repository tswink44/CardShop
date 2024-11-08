import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/CardDetail.css';  // Import styles for the card detail page

const CardDetail = () => {
    const { id } = useParams();  // Get the card ID from the URL
    const [product, setProduct] = useState(null);  // State to hold the fetched card data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the individual card details by ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/store/card/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load product.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Display the product details
    return (
        <div className="card-detail">
            <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>In Stock:</strong> {product.quantity}</p>
            <button>Add to Cart</button>
        </div>
    );
};

export default CardDetail;