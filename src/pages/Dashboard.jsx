import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from '../components/Chart';
import DeviceControl from '../components/DeviceControl';
import '../styles/Dashboard.css';
import '../styles/heading.css';

const Dashboard = () => {
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [light, setLight] = useState(0);
    const [dataHistory, setDataHistory] = useState([]);

    // Hàm gọi API lấy dữ liệu mới nhất
    const fetchLatestSensorData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/sensors/latest');
            const data = response.data;
            setTemperature(data.temperature);
            setHumidity(data.humidity);
            setLight(data.light_value);

            // Cập nhật lịch sử dữ liệu cho Chart
            setDataHistory(prevData => {
                const newData = [
                    ...prevData,
                    {
                        name: new Date(data.timestamp).toLocaleTimeString(),
                        temperature: data.temperature,
                        humidity: data.humidity,
                        light: data.light_value,
                    }
                ];
                return newData.length > 10 ? newData.slice(-10) : newData;
            });
        } catch (error) {
            console.error('Error fetching latest sensor data:', error);
        }
    };

    // Hàm gọi API lấy toàn bộ dữ liệu trong ngày cho Chart
    const fetchTodaySensorData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/sensors/today');
            const todayData = response.data.map(entry => ({
                name: new Date(entry.timestamp).toLocaleTimeString(),
                temperature: entry.temperature,
                humidity: entry.humidity,
                light: entry.light_value,
            }));
            setDataHistory(todayData);
        } catch (error) {
            console.error('Error fetching today sensor data:', error);
        }
    };

    // Lấy dữ liệu mới nhất mỗi giây
    useEffect(() => {
        fetchTodaySensorData(); // Lấy dữ liệu trong ngày khi trang được load

        const intervalId = setInterval(() => {
            fetchLatestSensorData();
        }, 1000);

        return () => clearInterval(intervalId); // Clear interval khi component unmount
    }, []);

    // Hàm để tính màu nhiệt độ (từ xanh dương -> cam -> đỏ)
    const getTemperatureColor = (temp) => {
        if (temp < 20) {
            return `linear-gradient(135deg, #3498db, #2980b9)`;
        } else if (temp >= 20 && temp < 25) {
            return `linear-gradient(135deg, #f1c40f, #f39c12)`;
        } else if (temp >= 25 && temp < 30) {
            return `linear-gradient(135deg, #f39c12, #e67e22)`;
        } else if (temp >= 30 && temp < 35) {
            return `linear-gradient(135deg, #e67e22, #d35400)`;
        } else if (temp >= 35 && temp < 60) {
            return `linear-gradient(135deg, #d35400, #e74c3c)`;
        } else if (temp >= 60 && temp < 70) {
            return `linear-gradient(135deg, #e74c3c, #c0392b)`;
        } else if (temp >= 70) {
            return `linear-gradient(135deg, #c0392b, #a93226)`;
        }
    };

    // Các hàm tính màu cho ánh sáng và độ ẩm như trước
    const getLightColor = (light) => {
        if (light < 200) {
            return `linear-gradient(135deg, #9b59b6, #8e44ad)`;
        } else if (light >= 200 && light < 800) {
            return `linear-gradient(135deg, #f39c12, #f1c40f)`;
        } else {
            return `linear-gradient(135deg, #f8f9fa, #f1f2f6)`;
        }
    };

    const getHumidityColor = (humidity) => {
        if (humidity < 40) {
            return `linear-gradient(135deg, #2ecc71, #27ae60)`;
        } else if (humidity >= 40 && humidity < 70) {
            return `linear-gradient(135deg, #3498db, #2980b9)`;
        } else {
            return `linear-gradient(135deg, #16a085, #1abc9c)`;
        }
    };

    return (
        <div className="dashboard animated-enter-scale">
            <h1 className="heading-card">Dashboard</h1>
            <div className="stats-cards">
                <div
                    className="card temperature-card"
                    style={{ background: getTemperatureColor(temperature) }}
                >
                    <h2>Temperature</h2>
                    <p>{temperature}°C</p>
                </div>
                <div
                    className="card humidity-card"
                    style={{ background: getHumidityColor(humidity) }}
                >
                    <h2>Humidity</h2>
                    <p>{humidity}%</p>
                </div>
                <div
                    className="card light-card"
                    style={{ background: getLightColor(light) }}
                >
                    <h2>Light Intensity</h2>
                    <p>{light}%</p>
                </div>
            </div>

            <div className="chart-card">
                <Chart data={dataHistory} />
            </div>

            <DeviceControl />
        </div>
    );
};

export default Dashboard;
