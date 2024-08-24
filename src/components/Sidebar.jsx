import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTable, FaHistory, FaUser, FaBars } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                <FaBars />
            </button>
            <nav className="menu">
                <NavLink to="/dashboard" className="menu-item">
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/data-sensor" className="menu-item">
                    <FaTable />
                    <span>Data Sensor</span>
                </NavLink>
                <NavLink to="/action-history" className="menu-item">
                    <FaHistory />
                    <span>Action History</span>
                </NavLink>
                <NavLink to="/profile" className="menu-item">
                    <FaUser />
                    <span>Profile</span>
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;
