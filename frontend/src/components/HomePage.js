import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './HomePage.css';

const HomePage = () => {
    const [isVisible, setIsVisible] = useState(false);

    const { ref, inView } = useInView({
        triggerOnce: true, // Trigger animation only once when the element comes into view
        threshold: 0.5, // 50% of the image is in the viewport
    });

    useEffect(() => {
        if (inView) {
            setIsVisible(true);
        }
    }, [inView]);

    const images = [
        { src: '/assets/images/homepage1.png', alt: 'Image 1', caption: 'Card Display' },
        { src: '/assets/images/homepage2.png', alt: 'Image 2', caption: 'Players playing card games' },
        { src: '/assets/images/homepage3.png', alt: 'Image 3', caption: 'Graded Cards' },

    ];

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
                    <div className="product">
                        <img src="/assets/images/homepage1.png" alt="Product 1" />
                        <h3>Product 1</h3>
                        <p>$25.99</p>
                        <button>View Product</button>
                    </div>
                    <div className="product">
                        <img src="/assets/images/homepage2.png" alt="Product 2" />
                        <h3>Product 2</h3>
                        <p>$39.99</p>
                        <button>View Product</button>
                    </div>
                    <div className="product">
                        <img src="/assets/images/homepage3.png" alt="Product 3" />
                        <h3>Product 3</h3>
                        <p>$49.99</p>
                        <button>View Product</button>
                    </div>
                </div>
                <button className="view-all-btn">View All Products</button>
            </section>

            {/* Testimonials Section */}
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
