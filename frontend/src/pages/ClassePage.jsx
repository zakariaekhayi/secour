// src/pages/ClassePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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
        return <div>Chargement...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Gestion des Classes</h2>
                <button onClick={handleAdd}>Ajouter une classe</button>
            </div>

            {showForm && (
                <div style={{ marginBottom: '20px', border: '1px solid black', padding: '20px' }}>
                    <h3>{editMode ? 'Modifier la classe' : 'Ajouter une classe'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Nom:</label>
                            <input
                                type="text"
                                value={currentClasse.nom}
                                onChange={(e) => setCurrentClasse({...currentClasse, nom: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                                disabled={editMode}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Niveau:</label>
                            <input
                                type="text"
                                value={currentClasse.niveau}
                                onChange={(e) => setCurrentClasse({...currentClasse, niveau: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Filière:</label>
                            <input
                                type="text"
                                value={currentClasse.filiere}
                                onChange={(e) => setCurrentClasse({...currentClasse, filiere: e.target.value})}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                required
                            />
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
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Niveau</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Filière</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {classes.map((classe) => (
                    <tr key={classe.nom}>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{classe.nom}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{classe.niveau}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{classe.filiere}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>
                            <button onClick={() => handleEdit(classe)} style={{ marginRight: '5px' }}>
                                Modifier
                            </button>
                            <button onClick={() => handleDelete(classe.nom)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {classes.length === 0 && (
                <p style={{ marginTop: '20px' }}>Aucune classe trouvée.</p>
            )}
        </div>
    );
};

export default ClassePage;