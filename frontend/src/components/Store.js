import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Store.css';  // Import styles for the store page

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
        <div className="store">
            <h1>Our Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product">
                        <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <Link to={`/card/${product.id}`}>View Product</Link> {/* Link to individual product details page */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;