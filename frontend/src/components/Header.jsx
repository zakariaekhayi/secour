import React from 'react';

const Header = ({ user, onLogout }) => {
    return (
        <div style={{ padding: '10px', borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Dashboard Admin</h2>
            <div>
                <span>Bienvenue, {user?.nomComplet || user?.username}</span>
                <button onClick={onLogout} style={{ marginLeft: '10px' }}>Déconnexion</button>
            </div>
        </div>
    );
};

export default Header;