import React, { useState, useEffect } from 'react';
import Chart from '../components/Chart';
import DeviceControl from '../components/DeviceControl';
import '../styles/Dashboard.css';
import '../styles/heading.css';
import { connectToMQTT } from '../mqtt';

// const temperatureValues = [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40];

const Dashboard = () => {
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [light, setLight] = useState(0);
    const [dataHistory, setDataHistory] = useState([]);

    useEffect(() => {
        // Kết nối tới MQTT broker khi component mount
        const { disconnect } = connectToMQTT((message) => {
            try {
                // Phân tích chuỗi JSON nhận từ MQTT
                const data = JSON.parse(message);
                // Cập nhật state với dữ liệu từ JSON
                setTemperature(data.temperature);
                setHumidity(data.humidity);
                setLight(data.light_value);

                // Cập nhật lịch sử dữ liệu
                setDataHistory((prevData) => {
                    const newData = [
                        ...prevData,
                        {
                            name: new Date().toLocaleTimeString(),
                            temperature: data.temperature,
                            humidity: data.humidity,
                            light: data.light_value
                        }
                    ];

                    // Giới hạn số lượng dữ liệu hiển thị là 10
                    return newData.length > 10 ? newData.slice(-10) : newData;
                });

            } catch (error) {
                console.error('Error parsing MQTT message:', error);
            }
        });

        // Ngắt kết nối khi component unmount
        return () => {
            disconnect();
        };
    }, []);

    // useEffect(() => {
    //     let index = 0;
    //
    //     const interval = setInterval(() => {
    //         setTemperature(temperatureValues[index]);
    //         index = (index + 1) % temperatureValues.length;
    //     }, 2000);
    //
    //     return () => clearInterval(interval);
    // }, []);

    // Hàm để tính màu nhiệt độ (từ xanh dương -> cam -> đỏ)
    const getTemperatureColor = (temp) => {
        if (temp < 20) {
            return `linear-gradient(135deg, #3498db, #2980b9)`; // Màu xanh dương
        } else if (temperature >= 20 && temperature < 25) {
            return `linear-gradient(135deg, #f1c40f, #f39c12)`; // Cam level 1
        } else if (temperature >= 25 && temperature < 30) {
            return `linear-gradient(135deg, #f39c12, #e67e22)`; // Cam level 2
        } else if (temperature >= 30 && temperature < 35) {
            return `linear-gradient(135deg, #e67e22, #d35400)`; // Cam level 3
        } else if (temperature >= 35 && temperature < 60) {
            return `linear-gradient(135deg, #d35400, #e74c3c)`; // Cam đậm dần
        } else if (temperature >= 60 && temperature < 70) {
            return `linear-gradient(135deg, #e74c3c, #c0392b)`; // Đỏ nhạt
        } else if (temperature >= 70) {
            return `linear-gradient(135deg, #c0392b, #a93226)`; // Đỏ đậm khi rất nóng
        }
    };

    // Hàm để tính màu độ sáng (từ tím -> cam -> trắng)
    const getLightColor = (light) => {
        if (light < 200) {
            return `linear-gradient(135deg, #9b59b6, #8e44ad)`; // Màu tím
        } else if (light >= 200 && light < 800) {
            return `linear-gradient(135deg, #f39c12, #f1c40f)`; // Màu cam
        } else {
            return `linear-gradient(135deg, #f8f9fa, #f1f2f6)`; // Màu trắng sáng
        }
    };

    // Hàm để tính màu độ ẩm (ví dụ: từ xanh lá -> xanh dương)
    const getHumidityColor = (humidity) => {
        if (humidity < 40) {
            return `linear-gradient(135deg, #2ecc71, #27ae60)`; // Màu xanh lá
        } else if (humidity >= 40 && humidity < 70) {
            return `linear-gradient(135deg, #3498db, #2980b9)`; // Màu xanh dương
        } else {
            return `linear-gradient(135deg, #16a085, #1abc9c)`; // Màu xanh đậm
        }
    };

    return (
        <div className="dashboard animated-enter-scale">
            <h1 className="heading-card ">Dashboard</h1>
            <div className="stats-cards">
                {/* Card nhiệt độ */}
                <div
                    className="card temperature-card"
                    style={{background: getTemperatureColor(temperature)}}
                >
                    <h2>Temperature</h2>
                    <p>{temperature}°C</p>
                </div>

                {/* Card độ ẩm */}
                <div
                    className="card humidity-card"
                    style={{background: getHumidityColor(humidity)}}
                >
                    <h2>Humidity</h2>
                    <p>{humidity}%</p>
                </div>

                {/* Card ánh sáng */}
                <div
                    className="card light-card"
                    style={{background: getLightColor(light)}}
                >
                    <h2>Light Intensity</h2>
                    <p>{light}%</p>
                </div>
            </div>

            <div className="chart-card">
                <Chart data={dataHistory} />
            </div>

            <DeviceControl/>
        </div>
    );
}

export default Dashboard;
