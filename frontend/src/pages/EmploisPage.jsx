// src/pages/EmploisPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/EmploisPage.css';

const EmploisPage = () => {
    const [seances, setSeances] = useState([]);
    const [classes, setClasses] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAllSeances, setShowAllSeances] = useState(true);

    useEffect(() => {
        fetchClasses();
        fetchMatieres();
        fetchAllSeances();
    }, []);

    const fetchClasses = async () => {
        try {
            const data = await api.getAllClasses();
            setClasses(data);
        } catch (error) {
            console.error('Erreur chargement classes');
        }
    };

    const fetchMatieres = async () => {
        try {
            const data = await api.getAllMatieres();
            setMatieres(data);
        } catch (error) {
            console.error('Erreur chargement matières');
        }
    };

    const fetchAllSeances = async () => {
        try {
            setLoading(true);
            const data = await api.getAllSeances();
            setSeances(data);
            setShowAllSeances(true);
        } catch (error) {
            alert('Erreur chargement séances');
        } finally {
            setLoading(false);
        }
    };

    const fetchSeancesByClasse = async (nomClasse) => {
        try {
            setLoading(true);
            const data = await api.getSeancesByClasse(nomClasse);
            setSeances(data);
            setShowAllSeances(false);
        } catch (error) {
            alert('Erreur chargement séances de la classe');
        } finally {
            setLoading(false);
        }
    };

    const handleClasseChange = (e) => {
        const classe = e.target.value;
        setSelectedClasse(classe);
        if (classe === '') {
            fetchAllSeances();
        } else {
            fetchSeancesByClasse(classe);
        }
    };

    const getMatiereInfo = (idMatiere) => {
        const matiere = matieres.find(m => m.id === idMatiere);
        if (!matiere) {
            console.warn(`❌ Matière non trouvée pour ID: ${idMatiere}`);
            return { nom_cour: 'Inconnu', type_cour: 'N/A' };
        }
        // ✅ Utilise les champs en camelCase comme renvoyés par Spring Boot
        return {
            nom_cour: matiere.nomCour || 'Inconnu',
            type_cour: matiere.typeCour || 'N/A'
        };
    };

    const normalizeHeure = (heure) => {
        return heure ? heure.substring(0, 8) : '';
    };

    const getCouleurTypeCour = (typeCour) => {
        console.log('Type de cours reçu :', typeCour); // ✅ Log pour débugger
        if (!typeCour) return 'default-bg';
        const type = typeCour.toLowerCase().trim();
        switch (type) {
            case 'cours': return 'cours-bg';
            case 'td':    return 'td-bg';
            case 'tp':    return 'tp-bg';
            default:      return 'default-bg';
        }
    };

    const renderEmploiDuTemps = () => {
        if (!selectedClasse || showAllSeances) return null;

        const seancesClasse = seances.filter(s => s.nomClasse === selectedClasse);

        const emploi = {};
        seancesClasse.forEach(seance => {
            const jour = seance.jour;
            const heure = normalizeHeure(seance.heureDebut);
            if (!emploi[jour]) emploi[jour] = {};
            if (!emploi[jour][heure]) emploi[jour][heure] = [];
            emploi[jour][heure].push(seance);
        });

        const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        const creneaux = ['08:30:00', '10:45:00', '14:00:00', '16:15:00'];
        const creneauxLabels = ['8h30 → 10h30', '10h45 → 12h45', '14h → 16h', '16h15 → 18h15'];

        return (
            <div className="emploi-container">
                <h3 className="emploi-title">
                    📅 Emploi du temps de la classe {selectedClasse}
                </h3>
                <table className="emploi-table">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Jour</th>
                            {creneauxLabels.map((label, index) => (
                                <th key={index} style={{ width: '21.25%' }}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {jours.map(jour => (
                            <tr key={jour}>
                                <td className="jour-cell">
                                    {jour}
                                </td>
                                {creneaux.map(creneau => (
                                    <td key={creneau}>
                                        {emploi[jour]?.[creneau] ? (
                                            (() => {
                                                const seancesCreneau = emploi[jour][creneau];
                                                const matieresGroupees = {};
                                                seancesCreneau.forEach(seance => {
                                                    const matiereInfo = getMatiereInfo(seance.idMatiere);
                                                    const key = `${matiereInfo.nom_cour}_${matiereInfo.type_cour}`;
                                                    if (!matieresGroupees[key]) matieresGroupees[key] = [];
                                                    matieresGroupees[key].push({ ...seance, matiereInfo });
                                                });

                                                return Object.values(matieresGroupees).map((group, idx) => {
                                                    const first = group[0];
                                                    const cssClass = getCouleurTypeCour(first.matiereInfo.type_cour);
                                                    return (
                                                        <div key={idx} className={`seance-item ${cssClass}`}>
                                                            <div className="seance-title">
                                                                {first.matiereInfo.nom_cour}
                                                            </div>
                                                            <div className="seance-type">
                                                                {first.matiereInfo.type_cour}
                                                            </div>
                                                            {group.length > 1 ? (
                                                                group.map((s, i) => (
                                                                    <div key={i} className="groupe-item">
                                                                        <div className="seance-groupe">
                                                                            {s.groupe || 'G'}
                                                                        </div>
                                                                        <div className="seance-info">👨‍🏫 {s.nomProf}</div>
                                                                        <div className="seance-info">🏫 {s.nomSalle}</div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <div className="seance-info">👨‍🏫 {first.nomProf}</div>
                                                                    <div className="seance-info">🏫 {first.nomSalle}</div>
                                                                    {first.groupe && (
                                                                        <div className="seance-groupe">
                                                                            {first.groupe}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                });
                                            })()
                                        ) : (
                                            <span className="empty-cell">-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="emplois-page-container">
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
        <div className="emplois-page-container">
            <div className="page-header d-flex justify-content-between align-items-center">
                <h2 className="page-title">📅 Gestion des Emplois du Temps</h2>
                <div className="filter-container">
                    <label className="filter-label">Classe :</label>
                    <select
                        className="filter-select"
                        value={selectedClasse}
                        onChange={handleClasseChange}
                    >
                        <option value="">Toutes les classes</option>
                        {classes.map(classe => (
                            <option key={classe.nom} value={classe.nom}>
                                {classe.nom}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {renderEmploiDuTemps()}

            <div className="seances-section">
                <h3 className="seances-title">
                    {showAllSeances ? 'Toutes les séances' : `Séances de ${selectedClasse}`}
                </h3>

                <div className="table-container">
                    <table className="table table-custom">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Classe</th>
                                <th>Matière</th>
                                <th>Type</th>
                                <th>Prof</th>
                                <th>Salle</th>
                                <th>Début</th>
                                <th>Fin</th>
                                <th>Jour</th>
                                <th>Groupe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(showAllSeances ? seances : seances.filter(s => s.nomClasse === selectedClasse))
                                .map(seance => {
                                    const matiere = getMatiereInfo(seance.idMatiere);
                                    return (
                                        <tr key={seance.id}>
                                            <td>{seance.id}</td>
                                            <td>{seance.nomClasse}</td>
                                            <td>{matiere.nom_cour}</td>
                                            <td>{matiere.type_cour}</td>
                                            <td>{seance.nomProf}</td>
                                            <td>{seance.nomSalle}</td>
                                            <td>{normalizeHeure(seance.heureDebut)}</td>
                                            <td>{normalizeHeure(seance.heureFin)}</td>
                                            <td>{seance.jour}</td>
                                            <td>{seance.groupe || '-'}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {seances.length === 0 && (
                    <div className="empty-message">
                        <i className="fas fa-calendar-times fa-3x mb-3"></i>
                        <p>Aucune séance trouvée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmploisPage;