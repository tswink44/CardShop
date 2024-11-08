import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/CardDetail.css';
import { useCartContext } from './CartContext';  // Import CartContext to add items to the cart

const CardDetail = () => {
    const { id } = useParams();  // Get the card ID from the URL
    const [product, setProduct] = useState(null);  // Store the fetched product
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const [quantityToAdd, setQuantityToAdd] = useState(1);  // The quantity to add to the cart

    const { addToCart, cartItems } = useCartContext();  // Using the CartContext

    // Fetch the card (product) based on its ID
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

    // Find out how many of this product are currently in the cart, if any
    const cartItem = cartItems.find(item => item.id === product.id);
    const availableStock = product.quantity - (cartItem ? cartItem.quantity : 0);

    const handleAddToCart = () => {
        if (quantityToAdd > availableStock) {
            alert(`You can't add more than ${availableStock} items to the cart.`);
            return;
        }
        addToCart({ ...product, quantity: quantityToAdd });
        alert('Added to cart!');
    };

    return (
        <div className="card-detail">
            <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>In Stock:</strong> {availableStock} items remaining</p>

            {/* Allow the user to select how many to add */}
            <input
                type="number"
                min="1"
                max={availableStock}  // Do not allow users to choose more than what's available
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
            />

            {/* Add to Cart Button */}
            <button onClick={handleAddToCart} disabled={availableStock <= 0}>
                Add to Cart
            </button>
        </div>
    );
};

export default CardDetail;