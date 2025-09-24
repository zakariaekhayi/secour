// src/pages/SallePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/SallePage.css';

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
        return (
            <div className="salle-page-container">
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="loading-text">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="salle-page-container">
            <div className="page-header d-flex justify-content-between align-items-center">
                <h2 className="page-title">Gestion des Salles</h2>
                <button className="btn btn-add-salle" onClick={handleAdd}>
                    <i className="fas fa-plus me-2"></i>
                    Ajouter une salle
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h3 className="form-title">
                        {editMode ? 'Modifier la salle' : 'Ajouter une salle'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nom:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentSalle.nom}
                                onChange={(e) => setCurrentSalle({...currentSalle, nom: e.target.value})}
                                required
                                disabled={editMode}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Bâtiment:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentSalle.batiment}
                                onChange={(e) => setCurrentSalle({...currentSalle, batiment: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type:</label>
                            <select
                                className="form-control"
                                value={currentSalle.type}
                                onChange={(e) => setCurrentSalle({...currentSalle, type: e.target.value})}
                                required
                            >
                                <option value="salle">Salle</option>
                                <option value="amphi">Amphi</option>
                                <option value="atelier">Atelier</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary-custom">
                                <i className={`fas ${editMode ? 'fa-save' : 'fa-plus'} me-2`}></i>
                                {editMode ? 'Modifier' : 'Ajouter'}
                            </button>
                            <button type="button" className="btn btn-secondary-custom" onClick={handleCancel}>
                                <i className="fas fa-times me-2"></i>
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="table table-custom">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Bâtiment</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salles.map((salle) => (
                            <tr key={salle.nom}>
                                <td>{salle.nom}</td>
                                <td>{salle.batiment}</td>
                                <td>{salle.type}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => handleEdit(salle)}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() => handleDelete(salle.nom)}
                                        >
                                            <i className="fas fa-trash me-1"></i>
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {salles.length === 0 && (
                <div className="empty-message">
                    <i className="fas fa-door-open fa-3x mb-3"></i>
                    <p>Aucune salle trouvée.</p>
                </div>
            )}
        </div>
    );
};

export default SallePage;