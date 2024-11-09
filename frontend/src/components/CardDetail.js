import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../styles/CardDetail.module.css';
import { useCartContext } from './CartContext';

/**
 * CardDetail component displays the details of a specific product and allows it to be added to the cart.
 *
 * @function
 * @returns {JSX.Element} A component that renders the details of a product.
 *
 * @description
 * This component fetches the product details based on the product ID obtained from the URL parameters. It displays the product image, name, description, price, and available stock. Users can specify the quantity to add to the cart and add the product to the cart, taking into account the current available stock.
 *
 * @throws {Error} If there's an error fetching the product, the error message is displayed.
 * @example
 * // Fetching a product with ID from URL params and displaying its details.
 */
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
        return <div className={styles.loading}>Loading product details...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }


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
        <div className={styles.cardDetail}>
            <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>In Stock:</strong> {availableStock} items remaining</p>


            <input
                type="number"
                min="1"
                max={availableStock}  // Do not allow users to choose more than what's available
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
            />


            <button onClick={handleAddToCart} disabled={availableStock <= 0}>
                Add to Cart
            </button>
        </div>
    );
};

export default CardDetail;