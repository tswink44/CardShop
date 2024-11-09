import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/HomePage.css';
import {Link} from "react-router-dom";  // Ensure this path is correct

const HomePage = () => {
    const [products, setProducts] = useState([]);  // State to hold product listings
    const [loading, setLoading] = useState(true);  // State for loading spinner
    const [error, setError] = useState(null);  // State to handle errors

    // Fetch product listings from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/store/cards');  // API endpoint to get featured products
                setProducts(response.data);  // Store the fetched products in state
                setLoading(false);
            } catch (err) {
                setError("Failed to load products.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle the loading state
    if (loading) {
        return <div>Loading featured products...</div>;
    }

    // Handle the error state
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to the Card Shop</h1>
                    <p>Your one-stop shop for all trading card needs</p>
                    <button className="cta-btn">Shop Now</button>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-products">
                <h2>Featured Products</h2>
                <div className="products-grid">
                    {products.slice(0, 3).map((product) => (
                        <div key={product.id} className="product">
                            <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>${product.price}</p>
                            <button>View Product</button>
                        </div>
                    ))}
                </div>
                <button className="view-all-btn"><Link to="Store">View All Products</Link></button>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>What Our Customers Say</h2>
                <div className="testimonials-grid">
                    {/* Make sure to have customer images available */}
                    <div className="testimonial">
                        <img src="customer1.jpg" alt="Customer 1" />
                        <p>"I love the products! They arrived on time and exceeded my expectations."</p>
                        <h4>John D.</h4>
                    </div>
                    <div className="testimonial">
                        <img src="customer2.jpg" alt="Customer 2" />
                        <p>"Excellent customer service and great selection of items!"</p>
                        <h4>Jane S.</h4>
                    </div>
                </div>
                <button className="view-all-btn">Read More Reviews</button>
            </section>

            {/* About Us Section */}
            <section className="about-us">
                <h2>About Us</h2>
                <p>At YourStore, we're committed to providing the best products at the best prices. Our mission is to make shopping enjoyable and affordable for everyone.</p>
                <button className="cta-btn">Learn More</button>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-links">
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Contact</a>
                    <a href="#">FAQs</a>
                </div>
                <div className="social-media">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                </div>
                <div className="newsletter">
                    <input type="email" placeholder="Your email" />
                    <button>Subscribe</button>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;