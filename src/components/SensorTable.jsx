import React, { useState } from 'react';
import { FaThermometerHalf, FaTint, FaSun } from 'react-icons/fa';
import '../styles/table.css';
import '../styles/pagination.css';

const data = [
    { date: '2024-08-01', temperature: 22, humidity: 45, light: 78 },
    { date: '2024-08-02', temperature: 24, humidity: 50, light: 70 },
    { date: '2024-08-03', temperature: 23, humidity: 55, light: 80 },
    { date: '2024-08-04', temperature: 25, humidity: 60, light: 85 },
    { date: '2024-08-05', temperature: 30, humidity: 65, light: 90 },
    { date: '2024-08-06', temperature: 27, humidity: 70, light: 95 },
    { date: '2024-08-07', temperature: 28, humidity: 75, light: 100 },
    { date: '2024-08-08', temperature: 29, humidity: 80, light: 105 },
    { date: '2024-08-09', temperature: 30, humidity: 85, light: 110 },
    { date: '2024-08-10', temperature: 26, humidity: 90, light: 115 },
];

const SensorTable = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const sortedData = [...data].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="card">
            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th onClick={() => requestSort('date')}>Date</th>
                        <th onClick={() => requestSort('temperature')}>
                            <div className="icon-text-container"><FaThermometerHalf className="data-icon" /> Temperature </div>
                        </th>
                        <th onClick={() => requestSort('humidity')}>
                            <div className="icon-text-container"><FaTint className="data-icon"/> Humidity </div>
                        </th>
                        <th onClick={() => requestSort('light')}>
                            <div className="icon-text-container"><FaSun className="data-icon"/> Light </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.temperature}°C</td>
                            <td>{row.humidity}%</td>
                            <td>{row.light} lx</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SensorTable;
