import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFan, FaLightbulb } from 'react-icons/fa';
import '../styles/DeviceControl.css';

const DeviceControl = () => {
    const loadStateFromLocalStorage = () => {
        const savedDevices = localStorage.getItem('devices');
        if (savedDevices) {
            return JSON.parse(savedDevices);
        }
        return {
            light1: false,
            light2: false,
            light3: false,
        };
    };

    const [devices, setDevices] = useState(loadStateFromLocalStorage);

    useEffect(() => {
        localStorage.setItem('devices', JSON.stringify(devices));
    }, [devices]);

    const controlLedOnBackend = async (command) => {
        try {
            const timestamp = new Date().toISOString();
            const response = await axios.post('http://localhost:3000/api/led/control', { command, timestamp });
            console.log(response.data.message);
        } catch (error) {
            console.error('Error controlling LED:', error);
        }
    };

    const toggleDevice = (device) => {
        let newDevices;
        let command;

        if (device === 'all') {
            // Kiểm tra nếu tất cả các đèn đang bật thì tắt hết, ngược lại thì bật hết
            const allOn = devices.light1 && devices.light2 && devices.light3;
            newDevices = {
                light1: !allOn,
                light2: !allOn,
                light3: !allOn,
            };
            command = allOn ? 'off_all' : 'on_all';
        } else {
            // Đổi trạng thái cho từng thiết bị và xác định lệnh tương ứng
            const newState = !devices[device];
            newDevices = { ...devices, [device]: newState };
            command = newState ? `on${device.slice(-1)}` : `off${device.slice(-1)}`;
        }

        controlLedOnBackend(command);
        setDevices(newDevices);
    };

    const isAllOn = devices.light1 && devices.light2 && devices.light3;

    return (
        <div className="device-control">
            <h2>Device Control</h2>
            <div className="device-buttons">
                <button
                    className={`device-button ${devices.light1 ? 'on' : 'off'}`}
                    onClick={() => toggleDevice('light1')}
                >
                    <FaFan className={`icon ${devices.light1 ? 'fan-rotate' : ''}`}/>
                    <span>Fan 1</span>
                </button>
                <button
                    className={`device-button ${devices.light2 ? 'on' : 'off'}`}
                    onClick={() => toggleDevice('light2')}
                >
                    <FaLightbulb className={`icon ${devices.light2 ? 'light-on' : ''}`}/>
                    <span>Light</span>
                </button>
                <button
                    className={`device-button ${devices.light3 ? 'on' : 'off'}`}
                    onClick={() => toggleDevice('light3')}
                >
                    <FaFan className={`icon ${devices.light3 ? 'fan-rotate' : ''}`}/>
                    <span>Fan 2</span>
                </button>
                <button
                    className={`device-button ${isAllOn ? 'on' : 'off'}`}
                    onClick={() => toggleDevice('all')}
                >
                    <FaLightbulb className={`icon ${isAllOn ? 'light-on' : ''}`}/>
                    <span>All Lights</span>
                </button>
            </div>
        </div>
    );
};

export default DeviceControl;
