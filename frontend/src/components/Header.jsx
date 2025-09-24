import React from 'react';
import '../styles/Header.css';

const Header = ({ user, onLogout }) => {
    return (
        <div className="header-container">
            <div className="header-content">
                <h2 className="header-title">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard Admin
                </h2>
                <div className="user-section">
                    <div className="user-info">
                        <div className="user-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        <div>
                            <div className="user-welcome">Bienvenue,</div>
                            <div className="user-name">{user?.nomComplet || user?.username}</div>
                        </div>
                    </div>
                    <button className="btn btn-logout" onClick={onLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;