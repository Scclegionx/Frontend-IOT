import React, { useState } from 'react';
import { FaFan, FaLightbulb } from 'react-icons/fa';
import '../styles/table.css'; // Giả sử chứa các kiểu dáng cho bảng
import '../styles/pagination.css'; // Giả sử chứa các kiểu dáng cho phân trang

const actionData = [
    { device: 'Fan 1', action: 'Turned On', time: '2024-08-21 14:00' },
    { device: 'Light', action: 'Turned Off', time: '2024-08-21 15:00' },
    { device: 'Fan 2', action: 'Turned On', time: '2024-08-22 08:30' },
    { device: 'Fan 1', action: 'Turned Off', time: '2024-08-22 10:00' },
    { device: 'Light', action: 'Turned On', time: '2024-08-23 12:00' },
    { device: 'Fan 2', action: 'Turned Off', time: '2024-08-23 14:00' },
    { device: 'Light', action: 'Turned Off', time: '2024-08-24 16:00' },
    { device: 'Fan 1', action: 'Turned On', time: '2024-08-24 18:00' },
    { device: 'Fan 2', action: 'Turned On', time: '2024-08-25 08:30' },
    { device: 'Light', action: 'Turned On', time: '2024-08-25 10:00' },
];

const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('fan')) return <FaFan className="icon device" />;
    if (device.toLowerCase().includes('light')) return <FaLightbulb className="icon device" />;
    return null;
};

const ActionHistoryTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState(actionData);
    const rowsPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    const handleSearch = () => {
        const start = startDate ? new Date(startDate) : new Date(-8640000000000000);
        const end = endDate ? new Date(endDate) : new Date(8640000000000000);

        const filtered = actionData.filter((row) => {
            const actionDate = new Date(row.time.split(' ')[0]);
            return actionDate >= start && actionDate <= end;
        });

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    };

    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="card">
            <div className="table-container">
                <div className="date-filter">
                    <label>
                        Start Date:
                        <input type="date" value={startDate} onChange={handleStartDateChange} />
                    </label>
                    <label>
                        End Date:
                        <input type="date" value={endDate} onChange={handleEndDateChange} />
                    </label>
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Device</th>
                        <th>Action</th>
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="icon-text-container">
                                        {getDeviceIcon(row.device)}
                                        {row.device}
                                    </div>
                                </td>
                                <td>{row.action}</td>
                                <td>{row.time}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }, (_, index) => (
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
                        disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ActionHistoryTable;
