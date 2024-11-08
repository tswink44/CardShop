
import React, { useState } from "react";
import axios from "../axios";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState({ name: "", email: "" });

    // Handle user login
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/login", userDetails);
            setUser(response.data); // Set the logged-in user
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {user ? (
                <div>
                    <h3>Welcome, {user.name}</h3>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <div>
                    <h3>Login</h3>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={userDetails.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={userDetails.email}
                            onChange={handleChange}
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
