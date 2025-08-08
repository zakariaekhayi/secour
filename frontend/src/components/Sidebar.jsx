// src/components/Sidebar.jsx - Version mise à jour
import React from 'react';

const Sidebar = ({ onMenuClick }) => {
    const handleClick = (page) => {
        onMenuClick(page);
    };

    return (
        <div style={{ width: '200px', height: '100vh', border: '1px solid black', padding: '20px' }}>
            <h3>Menu</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => handleClick('dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: 'black',
                            fontSize: '14px'
                        }}
                    >
                        Dashboard
                    </button>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => handleClick('classes')}
                        style={{
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: 'black',
                            fontSize: '14px'
                        }}
                    >
                        Classes
                    </button>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => handleClick('matieres')}
                        style={{
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: 'black',
                            fontSize: '14px'
                        }}
                    >
                        Matières
                    </button>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => handleClick('salles')}
                        style={{
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: 'black',
                            fontSize: '14px'
                        }}
                    >
                        Salles
                    </button>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => handleClick('emplois')}
                        style={{
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: 'black',
                            fontSize: '14px'
                        }}
                    >
                        Emplois
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;