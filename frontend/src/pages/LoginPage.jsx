import React, { useState } from 'react';
import { api } from '../services/api';
import '../styles/LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.login(username, password);

            if (response.success) {
                onLogin(response.user);
            } else {
                setError(response.message || 'Erreur de connexion');
            }
        } catch (error) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Connexion Admin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nom d'utilisateur:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mot de passe:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;