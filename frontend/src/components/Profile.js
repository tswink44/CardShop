import React from 'react';
import {Link} from "react-router-dom";

const Profile = () => {
    return (
        <div>
            <h1>Your Profile</h1>
            <p>Welcome to your profile page!</p>

            {/* Add new link for creating a listing */}
            <Link to="/create-listing">
                <button>Create a New Listing</button>
            </Link>
        </div>
    );}

export default Profile;