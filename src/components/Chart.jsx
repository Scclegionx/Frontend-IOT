import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Day 1', temperature: 22, humidity: 45, light: 78 },
    { name: 'Day 2', temperature: 23, humidity: 50, light: 70 },
    { name: 'Day 3', temperature: 21, humidity: 40, light: 80 },
    // Thêm dữ liệu khác...
];

const Chart = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                <Line type="monotone" dataKey="light" stroke="#ffc658" />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Chart;
