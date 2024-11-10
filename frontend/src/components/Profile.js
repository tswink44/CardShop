import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';
import axios from 'axios';
import styles from '../styles/Profile.module.css';

const Profile = () => {
    const { user } = useAuthContext();
    // const [avatar, setAvatar] = useState(null);
    // const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const baseUrl = "http://localhost:8000";  // Backend base URL

    useEffect(() => {
        if (!user) {
            const intervalId = setInterval(() => {
                window.location.reload();
            }, 5000);
            return () => clearInterval(intervalId);
        } else {
            // const fetchAvatar = async () => {
            //
            //     try {
            //         const token = localStorage.getItem('token');
            //         if (!token) {
            //             throw new Error('No token found');
            //         }
            //         const response = await axios.get(`http://localhost:8000/users/${user.id}/avatar`, {
            //             headers: {
            //                 Authorization: `Bearer ${token}`,
            //             },
            //         });
            //         if (response.status === 200) {
            //             const avatarPath = response.data.avatar_url;
            //             const fullAvatarUrl = `${baseUrl}${avatarPath}`;
            //             setAvatarUrl(fullAvatarUrl);
            //             console.log('Fetched avatar URL:', fullAvatarUrl);
            //         }
            //     } catch (err) {
            //         console.error("Failed to fetch avatar:", err);
            //     }
            // };
            // fetchAvatar();
        }
    }, [user]);

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setAvatar(file);
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setAvatarUrl(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setAvatarUrl(null);
    //     }
    // };

    // const handleUpload = async () => {
    //     if (!avatar) return;
    //     setUploading(true);
    //     const formData = new FormData();
    //     formData.append('file', avatar);
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post('http://localhost:8000/upload-avatar', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         console.log('Server response:', response.data);
    //         if (response.status === 200) {
    //             const avatarPath = response.data.avatar_url;
    //             const fullAvatarUrl = `${baseUrl}${avatarPath}`;
    //             setAvatarUrl(fullAvatarUrl);
    //             console.log('New avatar URL:', fullAvatarUrl);
    //             setAvatar(null);
    //             alert("Avatar uploaded successfully!");
    //         } else {
    //             setError("Upload failed. Try again.");
    //         }
    //     } catch (err) {
    //         setError("An error occurred during the upload.");
    //         console.error('Error uploading avatar:', err);
    //     } finally {
    //         setUploading(false);
    //     }
    // };

    if (!user) {
        return <div>Loading user details...</div>;
    }

    return (
        <div className={styles.profile}>
            <div className={styles.profile__header}>
                <h1>Your Profile</h1>
                {/*<div className={styles.profile__avatarContainer}>*/}
                {/*    <img*/}
                {/*        className={styles.profile__avatar}*/}
                {/*        src={avatarUrl || "avatar-default.jpg"}*/}
                {/*        alt="User Avatar"*/}
                {/*    />*/}
                {/*</div>*/}
                <div className={styles.profile__info}>
                    <p className={styles.profile__name}>Username: {user.username}</p>
                    <p className={styles.profile__email}>Email: {user.email}</p>
                </div>
            </div>
            <div className={styles.profile__actions}>
                {/*<input*/}
                {/*    type="file"*/}
                {/*    accept="image/*"*/}
                {/*    onChange={handleFileChange}*/}
                {/*    className={styles.profile__fileInput}*/}
                {/*/>*/}
                {/*<button*/}
                {/*    onClick={handleUpload}*/}
                {/*    disabled={uploading || !avatar}*/}
                {/*    className={styles.profile__button}*/}
                {/*>*/}
                {/*    {uploading ? "Uploading..." : "Upload Avatar"}*/}
                {/*</button>*/}
                {error && <p className={styles.profile__error}>{error}</p>}
                <Link to="/create-listing">
                    <button className={styles.profile__button}>Create a New Listing</button>
                </Link>
                {user.is_admin && (
                    <div className={styles.profile__adminSection}>
                        <h2>Admin Section</h2>
                        <Link className={styles.profile__adminLink} to="/admin">Go to Admin Control Panel</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;