import React from 'react';
import ProfileCard from '../components/ProfileCard';

const Profile = () => {
    return (
        <div className="profile-container animated-enter">
            <h1 className="heading-card">Profile</h1>
            <ProfileCard />
        </div>
    );
}

export default Profile;
