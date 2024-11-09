import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';
import styles from '../styles/AdminPanel.module.css';

const AdminPanel = () => {
    const { user } = useAuthContext();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.is_admin) {
            axios.get('http://localhost:8000/store/cards')
                .then((response) => {
                    setListings(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Failed to load listings.');
                    setLoading(false);
                });
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const deleteListing = (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            axios.delete(`http://localhost:8000/cards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(() => {
                    setListings(listings.filter((listing) => listing.id !== id));
                    alert('Listing deleted successfully!');
                })
                .catch((err) => {
                    console.error(err);
                    alert('Failed to delete listing.');
                });
        }
    };

    if (loading) return <div className={styles.loading}>Loading listings...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.adminPanel}>
            <div className={styles.adminPanel__header}>
                <h1>Admin: Manage Listings</h1>
            </div>
            <div className={styles.adminPanel__tableContainer}>
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
                                <div className={styles.adminPanel__actions}>
                                    <Link to={`/edit-listing/${listing.id}`}>
                                        <button className={styles.editButton}>Edit</button>
                                    </Link>
                                    <button className={styles.deleteButton} onClick={() => deleteListing(listing.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;