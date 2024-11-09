import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/HomePage.css';
import {Link} from "react-router-dom";

/**
 * Represents the main HomePage component for the application.
 * This component fetches and displays featured products, customer testimonials,
 * and other informational sections about the store.
 *
 * State Variables:
 * - products: An array of product objects fetched from the API.
 * - loading: A boolean flag indicating whether the product data is still being loaded.
 * - error: A string containing the error message if the product data fails to load.
 *
 * Functionality:
 * - useEffect hook to fetch product data from the API endpoint and handle loading and error states.
 * - Displays a loading message while fetching data.
 * - Displays an error message if the fetch operation fails.
 * - Renders sections including Hero, Featured Products, Testimonials, About Us, and Footer.
 *
 * API Endpoint:
 * - 'http://localhost:8000/store/cards': Endpoint to get featured products.
 *
 * Components:
 * - Hero section: Brief introduction and a call-to-action button.
 * - Featured Products section: Displays the first three products.
 * - Testimonials section: Displays customer testimonials.
 * - About Us section: Information about the store.
 * - Footer section: Links to policies, social media, and a newsletter subscription form.
 */
const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/store/cards');  // API endpoint to get featured products
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
        return <div>Loading featured products...</div>;
    }


    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>

            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to the Card Shop</h1>
                    <p>Your one-stop shop for all trading card needs</p>
                    <button className="cta-btn">Shop Now</button>
                </div>
            </section>


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


            <section className="testimonials">
                <h2>What Our Customers Say</h2>
                <div className="testimonials-grid">

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


            <section className="about-us">
                <h2>About Us</h2>
                <p>At YourStore, we're committed to providing the best products at the best prices. Our mission is to make shopping enjoyable and affordable for everyone.</p>
                <button className="cta-btn">Learn More</button>
            </section>


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