import React from 'react';
import '../styles/profile.css';

const ProfileCard = () => {
    return (
        <div className="profile-card">
            <div className="profile-content">
                <img src="https://cdn.create.vista.com/common/119ac148-2128-4144-8d60-fb70db911e19_1024.jpg" alt="Profile" />
                <h1>Vũ Hoàng Anh</h1>
                <h2>B21DCCN166</h2>
                <p><a href="https://github.com/Scclegionx" target="_blank" rel="noopener noreferrer">GitHub</a></p>
            </div>
        </div>
    );
}

export default ProfileCard;
