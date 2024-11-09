import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';

/**
 * Profile is a functional component that displays the user's profile information.
 * It fetches the user data using the useAuthContext hook.
 * If the user data is not available, it displays a loading message.
 * If the user is an admin, it displays additional admin-specific content.
 */
const Profile = () => {
    const { user } = useAuthContext();


    if (!user) {
        return <div>Loading user details...</div>;
    }

    return (
        <div>
            <h1>Your Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>


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