//src/pages/MatierePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/MatierePage.css';

const MatierePage = () => {
    const [matieres, setMatieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentMatiere, setCurrentMatiere] = useState({
        nomCour: '',
        nomProf: '',
        typeCour: '',
        classeId: ''
    });
    const [originalId, setOriginalId] = useState('');

    useEffect(() => {
        fetchMatieres();
        fetchClasses();
    }, []);

    const fetchMatieres = async () => {
        try {
            setLoading(true);
            const data = await api.getAllMatieres();
            setMatieres(data);
        } catch (error) {
            alert('Erreur lors du chargement des matières');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await api.getAllClasses();
            setClasses(data);
        } catch (error) {
            console.error('Erreur lors du chargement des classes');
        }
    };

    const handleAdd = () => {
        setCurrentMatiere({
            nomCour: '',
            nomProf: '',
            typeCour: '',
            classeId: ''
        });
        setEditMode(false);
        setShowForm(true);
    };

    const handleEdit = (matiere) => {
        setCurrentMatiere(matiere);
        setOriginalId(matiere.id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
            try {
                await api.deleteMatiere(id);
                fetchMatieres();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.updateMatiere(originalId, currentMatiere);
            } else {
                await api.createMatiere(currentMatiere);
            }
            setShowForm(false);
            fetchMatieres();
        } catch (error) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setCurrentMatiere({
            nomCour: '',
            nomProf: '',
            typeCour: '',
            classeId: ''
        });
    };

    const getClasseNom = (classeId) => {
        return classeId || 'Non assignée';
    };

    if (loading) {
        return (
            <div className="matiere-page-container">
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
        <div className="matiere-page-container">
            <div className="page-header d-flex justify-content-between align-items-center">
                <h2 className="page-title">Gestion des Matières</h2>
                <button className="btn btn-add-matiere" onClick={handleAdd}>
                    <i className="fas fa-plus me-2"></i>
                    Ajouter une matière
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h3 className="form-title">
                        {editMode ? 'Modifier la matière' : 'Ajouter une matière'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nom du cours:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentMatiere.nomCour}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, nomCour: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom du professeur:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentMatiere.nomProf}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, nomProf: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type de cours:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentMatiere.typeCour}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, typeCour: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Classe:</label>
                            <select
                                className="form-control"
                                value={currentMatiere.classeId}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, classeId: e.target.value})}
                                required
                            >
                                <option value="">Sélectionnez une classe</option>
                                {classes.map((classe) => (
                                    <option key={classe.nom} value={classe.nom}>
                                        {classe.nom}
                                    </option>
                                ))}
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
                            <th>ID</th>
                            <th>Nom du cours</th>
                            <th>Professeur</th>
                            <th>Type</th>
                            <th>Classe</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matieres.map((matiere) => (
                            <tr key={matiere.id}>
                                <td>{matiere.id}</td>
                                <td>{matiere.nomCour}</td>
                                <td>{matiere.nomProf}</td>
                                <td>{matiere.typeCour}</td>
                                <td>{getClasseNom(matiere.classeId)}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => handleEdit(matiere)}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() => handleDelete(matiere.id)}
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

            {matieres.length === 0 && (
                <div className="empty-message">
                    <i className="fas fa-book fa-3x mb-3"></i>
                    <p>Aucune matière trouvée.</p>
                </div>
            )}
        </div>
    );
};

export default MatierePage;