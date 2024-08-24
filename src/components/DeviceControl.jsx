import React, { useState, useEffect } from 'react';
import { FaFan, FaLightbulb } from 'react-icons/fa';
import '../styles/DeviceControl.css';

const DeviceControl = () => {
    const loadStateFromLocalStorage = () => {
        const savedDevices = localStorage.getItem('devices');
        if (savedDevices) {
            return JSON.parse(savedDevices);
        }
        return {
            fan1: false,
            light: false,
            fan2: false,
        };
    };

    const [devices, setDevices] = useState(loadStateFromLocalStorage);

    // Save state to localStorage whenever devices state changes
    useEffect(() => {
        localStorage.setItem('devices', JSON.stringify(devices));
    }, [devices]);

    const toggleDevice = (device) => {
        setDevices(prevDevices => ({
            ...prevDevices,
            [device]: !prevDevices[device],
        }));
    };

    return (
        <div className="device-control">
            <h2>Device Control</h2>
            <div className="device-buttons">
                <button className={`device-button ${devices.fan1 ? 'on' : 'off'}`} onClick={() => toggleDevice('fan1')}>
                    <FaFan className={`icon ${devices.fan1 ? 'fan-rotate' : ''}`} />
                    <span>Fan 1</span>
                </button>
                <button className={`device-button ${devices.light ? 'on' : 'off'}`} onClick={() => toggleDevice('light')}>
                    <FaLightbulb className={`icon ${devices.light ? 'light-on' : ''}`} />
                    <span>Light</span>
                </button>
                <button className={`device-button ${devices.fan2 ? 'on' : 'off'}`} onClick={() => toggleDevice('fan2')}>
                    <FaFan className={`icon ${devices.fan2 ? 'fan-rotate' : ''}`} />
                    <span>Fan 2</span>
                </button>
            </div>
        </div>
    );
}

export default DeviceControl;
