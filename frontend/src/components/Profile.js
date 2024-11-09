import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';  // Import the Auth context

const Profile = () => {
    const { user } = useAuthContext();  // Retrieve the authenticated user from context

    // Display a loading message if user data hasn't loaded yet
    if (!user) {
        return <div>Loading user details...</div>;  // Show a better placeholder if necessary
    }

    return (
        <div>
            <h1>Your Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>

            {/* Conditionally render an Admin Panel link if the user is an admin */}
            {user.is_admin && (
                <div>
                    <h2>Admin Section</h2>
                    <Link to="/admin">Go to Admin Control Panel</Link>
                </div>
            )}

            <Link to="/create-listing">
                <button>Create a New Listing</button>
            </Link>
        </div>
    );
};

export default Profile;