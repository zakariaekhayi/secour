import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/ClassePage.css';

const ClassePage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentClasse, setCurrentClasse] = useState({ nom: '', niveau: '', filiere: '' });
    const [originalNom, setOriginalNom] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await api.getAllClasses();
            setClasses(data);
        } catch (error) {
            alert('Erreur lors du chargement des classes');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setCurrentClasse({ nom: '', niveau: '', filiere: '' });
        setEditMode(false);
        setShowForm(true);
    };

    const handleEdit = (classe) => {
        setCurrentClasse(classe);
        setOriginalNom(classe.nom);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (nom) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
            try {
                await api.deleteClasse(nom);
                fetchClasses();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.updateClasse(originalNom, currentClasse);
            } else {
                await api.createClasse(currentClasse);
            }
            setShowForm(false);
            fetchClasses();
        } catch (error) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setCurrentClasse({ nom: '', niveau: '', filiere: '' });
    };

    if (loading) {
        return (
            <div className="classe-page-container">
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
        <div className="classe-page-container">
            {/* Header */}
            <div className="page-header d-flex justify-content-between align-items-center">
                <h2 className="page-title">Gestion des Classes</h2>
                <button onClick={handleAdd} className="btn btn-add-classe">
                    <i className="fas fa-plus me-2"></i>
                    Ajouter une classe
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="form-container">
                    <h3 className="form-title">
                        {editMode ? 'Modifier la classe' : 'Ajouter une classe'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">Nom de la classe:</label>
                                    <input
                                        type="text"
                                        value={currentClasse.nom}
                                        onChange={(e) => setCurrentClasse({...currentClasse, nom: e.target.value})}
                                        className="form-control"
                                        placeholder="Ex: L3-INFO-A"
                                        required
                                        disabled={editMode}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">Niveau:</label>
                                    <input
                                        type="text"
                                        value={currentClasse.niveau}
                                        onChange={(e) => setCurrentClasse({...currentClasse, niveau: e.target.value})}
                                        className="form-control"
                                        placeholder="Ex: L3, M1, M2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">Filière:</label>
                                    <input
                                        type="text"
                                        value={currentClasse.filiere}
                                        onChange={(e) => setCurrentClasse({...currentClasse, filiere: e.target.value})}
                                        className="form-control"
                                        placeholder="Ex: Informatique, Mathématiques"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary-custom">
                                <i className={`fas ${editMode ? 'fa-edit' : 'fa-save'} me-2`}></i>
                                {editMode ? 'Modifier' : 'Ajouter'}
                            </button>
                            <button type="button" onClick={handleCancel} className="btn btn-secondary-custom">
                                <i className="fas fa-times me-2"></i>
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tableau */}
            <div className="table-container">
                <table className="table table-custom">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Niveau</th>
                            <th>Filière</th>
                            <th style={{ width: '200px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classe) => (
                            <tr key={classe.nom}>
                                <td>
                                    <strong>{classe.nom}</strong>
                                </td>
                                <td>
                                    <span className="badge bg-primary">{classe.niveau}</span>
                                </td>
                                <td>{classe.filiere}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            onClick={() => handleEdit(classe)}
                                            className="btn btn-edit btn-sm"
                                            title="Modifier la classe"
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(classe.nom)}
                                            className="btn btn-delete btn-sm"
                                            title="Supprimer la classe"
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

            {/* Message si aucune classe */}
            {classes.length === 0 && !loading && (
                <div className="empty-message">
                    <i className="fas fa-graduation-cap fa-3x mb-3 text-muted"></i>
                    <h4>Aucune classe trouvée</h4>
                    <p className="mb-0">Commencez par ajouter votre première classe en cliquant sur le bouton "Ajouter une classe"</p>
                </div>
            )}
        </div>
    );
};

export default ClassePage;