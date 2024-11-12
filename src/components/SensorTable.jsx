import React, { useState, useEffect } from 'react';
import { FaThermometerHalf, FaTint, FaSun } from 'react-icons/fa';
import axios from 'axios';
import '../styles/table.css';
import '../styles/pagination.css';
import {formatInTimeZone} from "date-fns-tz";

const SensorTable = () => {
    const [sensorData, setSensorData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 5;

    // Lưu trạng thái các bộ lọc
    const [filters, setFilters] = useState({
        start: '',
        end: '',
        minTemperature: '',
        maxTemperature: '',
        minHumidity: '',
        maxHumidity: '',
        minLight: '',
        maxLight: ''
    });

    // Khi component mount hoặc có sự thay đổi ở page, filters hoặc sortConfig, gọi fetchData
    useEffect(() => {
        if (hasFiltersApplied()) {
            fetchFilteredAndPaginatedData(currentPage);  // Nếu có bộ lọc, gọi API lọc
        } else {
            fetchSortedAndPaginatedData(sortConfig.key, sortConfig.direction, currentPage);  // Nếu không có bộ lọc, gọi API sắp xếp
        }
    }, [filters, currentPage, sortConfig]);  // Chạy lại khi filters, currentPage, hoặc sortConfig thay đổi

    // Kiểm tra xem có bất kỳ bộ lọc nào đã được áp dụng không
    const hasFiltersApplied = () => {
        return Object.values(filters).some(value => value !== '');
    };

    // Hàm lấy dữ liệu đã sắp xếp và phân trang
    const fetchSortedAndPaginatedData = async (field, order, page) => {
        try {
            const response = await axios.get('http://localhost:3000/api/sensors/sort', {
                params: {
                    field,
                    order,
                    page,
                    limit: rowsPerPage
                }
            });
            setSensorData(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching sorted and paginated data:', error);
            setSensorData([]);  // Set to empty array in case of error
        }
    };

    // Hàm lọc dữ liệu theo range và phân trang
    const fetchFilteredAndPaginatedData = async (page) => {
        const { start, end, minTemperature, maxTemperature, minHumidity, maxHumidity, minLight, maxLight } = filters;

        try {
            const response = await axios.get('http://localhost:3000/api/sensors/range', {
                params: {
                    start,
                    end,
                    minTemperature,
                    maxTemperature,
                    minHumidity,
                    maxHumidity,
                    minLight,
                    maxLight,
                    page,
                    limit: rowsPerPage
                }
            });
            setSensorData(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching filtered and paginated data:', error);
            setSensorData([]);
        }
    };

    // Hàm xử lý thay đổi trong bộ lọc
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Hàm xử lý submit form lọc
    const handleRangeSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);  // Reset lại trang khi người dùng submit
        fetchFilteredAndPaginatedData(1);  // Tải lại dữ liệu đã lọc
    };

    // Hàm xử lý thay đổi sắp xếp
    const handleSortChange = (field) => {
        const order = sortConfig.key === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key: field, direction: order });
        setCurrentPage(1); // Reset lại trang khi thay đổi sắp xếp
    };

    // Hàm xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (timestamp) => {
        return formatInTimeZone(new Date(timestamp), 'UTC', "dd/MM/yyyy HH:mm:ss 'UTC'");
    };

    return (
        <div className="card">
            <div className="filter-container">
                <h3>Filter by Range</h3>
                <form onSubmit={handleRangeSubmit}>
                    {/* Thay đổi input để cho phép chọn ngày, giờ, phút và giây */}
                    <input type="datetime-local" name="start" value={filters.start} onChange={handleFilterChange} />
                    <input type="datetime-local" name="end" value={filters.end} onChange={handleFilterChange} />
                    <input type="number" name="minTemperature" placeholder="Min Temp" value={filters.minTemperature} onChange={handleFilterChange} />
                    <input type="number" name="maxTemperature" placeholder="Max Temp" value={filters.maxTemperature} onChange={handleFilterChange} />
                    <input type="number" name="minHumidity" placeholder="Min Humidity" value={filters.minHumidity} onChange={handleFilterChange} />
                    <input type="number" name="maxHumidity" placeholder="Max Humidity" value={filters.maxHumidity} onChange={handleFilterChange} />
                    <input type="number" name="minLight" placeholder="Min Light" value={filters.minLight} onChange={handleFilterChange} />
                    <input type="number" name="maxLight" placeholder="Max Light" value={filters.maxLight} onChange={handleFilterChange} />
                </form>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th onClick={() => handleSortChange('timestamp')}>Date</th>
                        <th onClick={() => handleSortChange('temperature')}>
                            <div className="icon-text-container"><FaThermometerHalf className="data-icon" /> Temperature</div>
                        </th>
                        <th onClick={() => handleSortChange('humidity')}>
                            <div className="icon-text-container"><FaTint className="data-icon" /> Humidity</div>
                        </th>
                        <th onClick={() => handleSortChange('light_value')}>
                            <div className="icon-text-container"><FaSun className="data-icon" /> Light</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sensorData.length > 0 ? (
                        sensorData.map((row, index) => (
                            <tr key={index}>
                                <td>{formatDate(row.timestamp)}</td>
                                <td>{row.temperature}°C</td>
                                <td>{row.humidity}%</td>
                                <td>{row.light_value} lx</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
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
                    {Array.from({ length: totalPages }, (_, index) => (
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
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SensorTable;