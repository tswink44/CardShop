import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styles from '../styles/HomePage.module.css';

/**
 * Represents the HomePage component.
 *
 * This component fetches and displays featured products from an API endpoint,
 * shows a hero section with a welcome message, displays customer testimonials,
 * and provides information about the store.
 *
 * State Variables:
 * - `products`: An array containing featured product data.
 * - `loading`: A boolean flag indicating loading status.
 * - `error`: A string containing any error messages related to fetching products.
 *
 * API Call:
 * - Fetches products from the endpoint 'http://localhost:8000/store/cards'.
 *
 * Sections:
 * - Hero: A welcome message with a call-to-action button.
 * - Featured Products: Displays a grid of featured products with images, names, prices, and links to individual product pages.
 * - Testimonials: Shows customer testimonials with images and quotes.
 * - About Us: Information about the store with a call-to-action button.
 * - Footer: Contains links to various pages, social media links, and a newsletter subscription input.
 *
 * Usage of useEffect Hook:
 * - Fetches product data from the API when the component mounts.
 *
 * Returns appropriate JSX based on loading and error state.
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
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Welcome to the Card Shop</h1>
                    <p>Your one-stop shop for all trading card needs</p>
                    <button className={styles.ctaBtn}>Shop Now</button>
                </div>
            </section>

            <section className={styles.featuredProducts}>
                <h2>Featured Products</h2>
                <div className={styles.productsGrid}>
                    {products.slice(0, 3).map((product) => (
                        <div key={product.id} className={styles.product}>
                            <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>${product.price}</p>
                            <Link to={`/card/${product.id}`}>
                                <button className={styles.ProductBtn}>View Product</button>
                            </Link>
                        </div>
                    ))}
                </div>
                <button className={styles.viewAllBtn}><Link to="/store">View All Products</Link></button>
            </section>

            <section className={styles.testimonials}>
                <h2>What Our Customers Say</h2>
                <div className={styles.testimonialsGrid}>
                    <div className={styles.testimonial}>
                        <img src="customer1.jpg" alt="Customer 1" />
                        <p>"I love the products! They arrived on time and exceeded my expectations."</p>
                        <h4>John D.</h4>
                    </div>
                    <div className={styles.testimonial}>
                        <img src="customer2.jpg" alt="Customer 2" />
                        <p>"Excellent customer service and great selection of items!"</p>
                        <h4>Jane S.</h4>
                    </div>
                </div>
                <button className={styles.viewAllBtn}>Read More Reviews</button>
            </section>

            <section className={styles.aboutUs}>
                <h2>About Us</h2>
                <p>At YourStore, we're committed to providing the best products at the best prices. Our mission is to make shopping enjoyable and affordable for everyone.</p>
                <button className={styles.ctaBtn}>Learn More</button>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerLinks}>
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Contact</a>
                    <a href="#">FAQs</a>
                </div>
                <div className={styles.socialMedia}>
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                </div>
                <div className={styles.newsletter}>
                    <input type="email" placeholder="Your email" />
                    <button className={styles.SubScrBtn}>Subscribe</button>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;