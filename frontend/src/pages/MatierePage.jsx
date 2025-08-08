// src/pages/MatierePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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
        return <div>Chargement...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Gestion des Matières</h2>
                <button onClick={handleAdd}>Ajouter une matière</button>
            </div>

            {showForm && (
                <div style={{ marginBottom: '20px', border: '1px solid black', padding: '20px' }}>
                    <h3>{editMode ? 'Modifier la matière' : 'Ajouter une matière'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Nom du cours:</label>
                            <input
                                type="text"
                                value={currentMatiere.nomCour}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, nomCour: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Nom du professeur:</label>
                            <input
                                type="text"
                                value={currentMatiere.nomProf}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, nomProf: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Type de cours:</label>
                            <input
                                type="text"
                                value={currentMatiere.typeCour}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, typeCour: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Classe:</label>
                            <select
                                value={currentMatiere.classeId}
                                onChange={(e) => setCurrentMatiere({...currentMatiere, classeId: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
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
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>ID</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Nom du cours</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Professeur</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Type</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Classe</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {matieres.map((matiere) => (
                    <tr key={matiere.id}>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{matiere.id}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{matiere.nomCour}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{matiere.nomProf}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{matiere.typeCour}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{getClasseNom(matiere.classeId)}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>
                            <button onClick={() => handleEdit(matiere)} style={{ marginRight: '5px' }}>
                                Modifier
                            </button>
                            <button onClick={() => handleDelete(matiere.id)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {matieres.length === 0 && (
                <p style={{ marginTop: '20px' }}>Aucune matière trouvée.</p>
            )}
        </div>
    );
};

export default MatierePage;