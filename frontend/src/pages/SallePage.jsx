// src/pages/SallePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const SallePage = () => {
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSalle, setCurrentSalle] = useState({ nom: '', batiment: '', type: 'salle' });
    const [originalNom, setOriginalNom] = useState('');

    useEffect(() => {
        fetchSalles();
    }, []);

    const fetchSalles = async () => {
        try {
            setLoading(true);
            const data = await api.getAllSalles();
            setSalles(data);
        } catch (error) {
            alert('Erreur lors du chargement des salles');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setCurrentSalle({ nom: '', batiment: '', type: 'salle' });
        setEditMode(false);
        setShowForm(true);
    };

    const handleEdit = (salle) => {
        setCurrentSalle(salle);
        setOriginalNom(salle.nom);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (nom) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
            try {
                await api.deleteSalle(nom);
                fetchSalles();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.updateSalle(originalNom, currentSalle);
            } else {
                await api.createSalle(currentSalle);
            }
            setShowForm(false);
            fetchSalles();
        } catch (error) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setCurrentSalle({ nom: '', batiment: '', type: 'salle' });
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Gestion des Salles</h2>
                <button onClick={handleAdd}>Ajouter une salle</button>
            </div>

            {showForm && (
                <div style={{ marginBottom: '20px', border: '1px solid black', padding: '20px' }}>
                    <h3>{editMode ? 'Modifier la salle' : 'Ajouter une salle'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Nom:</label>
                            <input
                                type="text"
                                value={currentSalle.nom}
                                onChange={(e) => setCurrentSalle({...currentSalle, nom: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                                disabled={editMode}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Bâtiment:</label>
                            <input
                                type="text"
                                value={currentSalle.batiment}
                                onChange={(e) => setCurrentSalle({...currentSalle, batiment: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Type:</label>
                            <select
                                value={currentSalle.type}
                                onChange={(e) => setCurrentSalle({...currentSalle, type: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            >
                                <option value="salle">Salle</option>
                                <option value="amphi">Amphi</option>
                                <option value="atelier">Atelier</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" style={{ marginRight: '10px' }}>
                                {editMode ? 'Modifier' : 'Ajouter'}
                            </button>
                            <button type="button" onClick={handleCancel}>Annuler</button>
                        </div>
                    </form>
                </div>
            )}

            <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid black' }}>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Nom</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Bâtiment</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Type</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {salles.map((salle) => (
                    <tr key={salle.nom}>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{salle.nom}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{salle.batiment}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{salle.type}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>
                            <button onClick={() => handleEdit(salle)} style={{ marginRight: '5px' }}>
                                Modifier
                            </button>
                            <button onClick={() => handleDelete(salle.nom)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {salles.length === 0 && (
                <p style={{ marginTop: '20px' }}>Aucune salle trouvée.</p>
            )}
        </div>
    );
};

export default SallePage;