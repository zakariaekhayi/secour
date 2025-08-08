import React, { useState } from 'react';
import { api } from '../services/api';

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ border: '1px solid black', padding: '20px', width: '300px' }}>
                <h2>Connexion Admin</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Nom d'utilisateur:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Mot de passe:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;