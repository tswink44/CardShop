import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/Store.module.css'; // Import CSS module

/**
 * Store component that fetches and displays a list of products from the server.
 *
 * This component handles the loading, error handling, and display of products
 * in a grid format. It fetches product data from the given API endpoint and
 * updates its state accordingly.
 *
 * State:
 * - products: An array of product objects fetched from the API.
 * - loading: A boolean that indicates whether the product data is currently being loaded.
 * - error: A string that holds any error message encountered during the fetch operation.
 *
 * Effects:
 * - useEffect: Fetches products from the API when the component mounts.
 *
 * Returns:
 * - A loading message if the data is still being fetched.
 * - An error message if there was a problem in fetching the data.
 * - A grid of product cards if the data is successfully fetched.
 *
 */
const Store = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/store/cards');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load products.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.store}>
            <h1>Our Products</h1>
            <div className={styles.productsGrid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.product}>
                        <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <Link to={`/card/${product.id}`}>View Product</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;