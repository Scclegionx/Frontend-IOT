import React from 'react';
import Chart from '../components/Chart';
import DeviceControl from '../components/DeviceControl';
import '../styles/Dashboard.css';
import '../styles/heading.css';

const Dashboard = () => {
    const latestData = {
        temperature: 24,
        humidity: 50,
        light: 75
    };

    return (
        <div className="dashboard animated-enter-scale">
            <h1 className="heading-card ">Dashboard</h1>
            <div className="stats-cards ">
                <div className="card temperature-card">
                    <h2>Temperature</h2>
                    <p>{latestData.temperature}°C</p>
                </div>
                <div className="card humidity-card">
                    <h2>Humidity</h2>
                    <p>{latestData.humidity}%</p>
                </div>
                <div className="card light-card">
                    <h2>Light Intensity</h2>
                    <p>{latestData.light} lx</p>
                </div>
            </div>

            <div className="chart-card">
                <Chart />
            </div>

            <DeviceControl />
        </div>
    );
}

export default Dashboard;
