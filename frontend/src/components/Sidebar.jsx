import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onMenuClick, currentPage = 'dashboard' }) => {
    const handleClick = (page) => {
        onMenuClick(page);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'classes', label: 'Classes', icon: '🎓' },
        { id: 'matieres', label: 'Matières', icon: '📚' },
        { id: 'salles', label: 'Salles', icon: '🏫' },
        { id: 'emplois', label: 'Emplois', icon: '📅' }
    ];

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h3 className="sidebar-title">Menu</h3>
            </div>
            <nav className="sidebar-nav">
                <ul className="nav">
                    {menuItems.map(item => (
                        <li key={item.id} className="nav-item">
                            <button
                                onClick={() => handleClick(item.id)}
                                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                                type="button"
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;