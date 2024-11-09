import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';  // Assuming you have an AuthProvider

const AdminPanel = () => {
    const { user } = useAuthContext();  // Get the authenticated user's info
    const [listings, setListings] = useState([]);  // Store product listings
    const [loading, setLoading] = useState(true);  // Loading state for fetching listings
    const [error, setError] = useState(null);  // Error state for handling errors
    const navigate = useNavigate();

    // Fetch listings when admin page loads
    useEffect(() => {
        if (user && user.is_admin) {
            axios.get('http://localhost:8000/store/cards')
                .then((response) => {
                    setListings(response.data);  // Set the listings in state
                    setLoading(false);  // Stop loading spinner
                })
                .catch((err) => {
                    console.error(err);
                    setError('Failed to load listings.');
                    setLoading(false);
                });
        } else {
            navigate('/');  // Redirect if user is not an admin
        }
    }, [user, navigate]);

    // Handle listing deletion
    const deleteListing = (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            axios.delete(`http://localhost:8000/cards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,  // JWT token for authorization
                },
            })
                .then(() => {
                    // Filter out the deleted listing from local state to update the UI
                    setListings(listings.filter((listing) => listing.id !== id));
                    alert('Listing deleted successfully!');
                })
                .catch((err) => {
                    console.error(err);
                    alert('Failed to delete listing.');
                });
        }
    };

    if (loading) return <div>Loading listings...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Admin: Manage Listings</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {listings.map((listing) => (
                    <tr key={listing.id}>
                        <td>{listing.name}</td>
                        <td>{listing.description}</td>
                        <td>${listing.price}</td>
                        <td>{listing.quantity}</td>
                        <td>
                            {/* Link to Edit Page */}
                            <Link to={`/edit-listing/${listing.id}`}>
                                <button>Edit</button>
                            </Link>
                            {/* Delete Button */}
                            <button onClick={() => deleteListing(listing.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;