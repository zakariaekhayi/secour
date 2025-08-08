import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ user, onLogout, children }) => {
    return (
        <div>
            <Header user={user} onLogout={onLogout} />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
