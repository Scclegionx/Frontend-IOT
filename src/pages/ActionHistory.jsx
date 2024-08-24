import React from 'react';
import ActionHistoryTable from '../components/ActionHistoryTable';

const ActionHistory = () => {
    return (
        <div className="animated-enter">
            <h1 className="heading-card">Action History</h1>
            <ActionHistoryTable />
        </div>
    );
}

export default ActionHistory;