// Các import giữ nguyên
import React, { useState, useEffect, useCallback } from 'react';
import { FaFan, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import debounce from 'lodash.debounce';
import '../styles/table.css';
import '../styles/pagination.css';

const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('fan')) return <FaFan className="icon device" />;
    if (device.toLowerCase().includes('light')) return <FaLightbulb className="icon device" />;
    return null;
};

const ActionHistoryTable = () => {
    const [actionData, setActionData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 10;

    // Lưu trạng thái của form range
    const [rangeFilters, setRangeFilters] = useState({
        start: '',
        end: ''
    });

    const [isRangeActive, setIsRangeActive] = useState(false);

    useEffect(() => {
        if (isRangeActive) {
            fetchRangeFilteredData(currentPage, rangeFilters);
        } else {
            fetchSortedData(sortConfig.key, sortConfig.direction, currentPage);
        }
    }, [sortConfig, currentPage, isRangeActive]);

    // Hàm gọi API để lấy dữ liệu sorted và phân trang
    const fetchSortedData = async (field, order, page) => {
        try {
            const response = await axios.get('http://localhost:3000/api/actionHistory/sortByTimestamp', {
                params: {
                    field,
                    order,
                    page,
                    limit: rowsPerPage
                }
            });
            setActionData(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching sorted data:', error);
            setActionData([]);
        }
    };

    // Hàm gọi API để lọc theo range và phân trang
    const fetchRangeFilteredData = async (page, filters) => {
        try {
            const response = await axios.get('http://localhost:3000/api/actionHistory/range', {
                params: {
                    start: filters.start,
                    end: filters.end,
                    page,
                    limit: rowsPerPage
                }
            });
            setActionData(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching range-filtered data:', error);
            setActionData([]);
        }
    };

    // Sử dụng useCallback để đảm bảo debounce không bị tạo lại mỗi lần component render
    const debouncedFetchRangeData = useCallback(
        debounce((newFilters) => {
            setRangeFilters(newFilters);
            setIsRangeActive(true);
            setCurrentPage(1); // Reset về trang đầu khi lọc
            fetchRangeFilteredData(1, newFilters); // Gọi dữ liệu với range
        }, 500),
        [] // Empty dependency array ensures debounce only initializes once
    );

    const handleRangeFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...rangeFilters,
            [name]: value
        };
        debouncedFetchRangeData(newFilters);
    };

    const handleSortChange = (field) => {
        const order = sortConfig.key === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key: field, direction: order });
        setCurrentPage(1); // Reset về trang đầu khi thay đổi sort
        setIsRangeActive(false); // Tắt lọc range khi thay đổi sort
    };

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
                <form>
                    <input
                        type="datetime-local"
                        name="start"
                        value={rangeFilters.start}
                        onChange={handleRangeFilterChange}
                    />
                    <input
                        type="datetime-local"
                        name="end"
                        value={rangeFilters.end}
                        onChange={handleRangeFilterChange}
                    />
                </form>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th onClick={() => handleSortChange('timestamp')}>Time</th>
                        <th>Device</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {actionData.length > 0 ? (
                        actionData.map((row, index) => (
                            <tr key={index}>
                                <td>{formatDate(row.timestamp)}</td>
                                <td>
                                    <div className="icon-text-container">
                                        {getDeviceIcon(row.device)}
                                        {row.device}
                                    </div>
                                </td>
                                <td>{row.action}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>No data available</td>
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

export default ActionHistoryTable;
