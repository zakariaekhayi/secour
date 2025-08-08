// src/pages/EmploisPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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
        if (!typeCour) return { backgroundColor: '#F5F5F5', borderLeft: '4px solid #999' };
        const type = typeCour.toLowerCase().trim();
        switch (type) {
            case 'cours': return { backgroundColor: '#E3F2FD', borderLeft: '4px solid #2196F3' };
            case 'td':    return { backgroundColor: '#FFF3E0', borderLeft: '4px solid #FF9800' };
            case 'tp':    return { backgroundColor: '#E8F5E8', borderLeft: '4px solid #4CAF50' };
            default:      return { backgroundColor: '#F5F5F5', borderLeft: '4px solid #999' };
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
            <div style={{ marginTop: '30px' }}>
                <h3>📅 Emploi du temps de la classe {selectedClasse}</h3>
                <table style={{
                    width: '100%',
                    border: '1px solid black',
                    borderCollapse: 'collapse',
                    margin: '20px 0'
                }}>
                    <thead>
                    <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                        <th style={{ padding: '10px', width: '15%', border: '1px solid black' }}>Jour</th>
                        {creneauxLabels.map((label, index) => (
                            <th key={index} style={{ padding: '10px', width: '21.25%', border: '1px solid black' }}>
                                {label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {jours.map(jour => (
                        <tr key={jour}>
                            <td style={{
                                padding: '10px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                border: '1px solid black'
                            }}>
                                {jour}
                            </td>
                            {creneaux.map(creneau => (
                                <td key={creneau} style={{
                                    padding: '5px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    border: '1px solid black',
                                    minHeight: '80px'
                                }}>
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
                                                const style = getCouleurTypeCour(first.matiereInfo.type_cour);
                                                return (
                                                    <div key={idx} style={{
                                                        ...style,
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        margin: '2px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                                                            {first.matiereInfo.nom_cour}
                                                        </div>
                                                        <div style={{ color: '#666', fontStyle: 'italic', marginBottom: '4px' }}>
                                                            {first.matiereInfo.type_cour}
                                                        </div>
                                                        {group.length > 1 ? (
                                                            group.map((s, i) => (
                                                                <div key={i} style={{
                                                                    margin: '2px 0',
                                                                    padding: '2px',
                                                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                                                    borderRadius: '3px'
                                                                }}>
                                                                    <div style={{ fontWeight: 'bold', color: '#1976D2', fontSize: '10px' }}>
                                                                        {s.groupe || 'G'}
                                                                    </div>
                                                                    <div style={{ fontSize: '10px' }}>👨‍🏫 {s.nomProf}</div>
                                                                    <div style={{ fontSize: '10px' }}>🏫 {s.nomSalle}</div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <div style={{ fontSize: '11px', marginBottom: '2px' }}>👨‍🏫 {first.nomProf}</div>
                                                                <div style={{ fontSize: '11px', marginBottom: '2px' }}>🏫 {first.nomSalle}</div>
                                                                {first.groupe && (
                                                                    <div style={{ fontWeight: 'bold', color: '#1976D2', fontSize: '10px' }}>
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
                                        <span style={{ color: '#888' }}>-</span>
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
        return <div style={{ padding: '20px' }}>Chargement...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2>📅 Gestion des Emplois du Temps</h2>
                <div>
                    <label style={{ marginRight: '10px' }}>Classe :</label>
                    <select value={selectedClasse} onChange={handleClasseChange} style={{ padding: '5px', marginRight: '10px' }}>
                        <option value="">Toutes les classes</option>
                        {classes.map(classe => (
                            <option key={classe.nom} value={classe.nom}>{classe.nom}</option>
                        ))}
                    </select>
                </div>
            </div>

            {renderEmploiDuTemps()}

            <div style={{ marginTop: '30px' }}>
                <h3>{showAllSeances ? 'Toutes les séances' : `Séances de ${selectedClasse}`}</h3>
                <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid black' }}>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Classe</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Matière</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Type</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Prof</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Salle</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Début</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Fin</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Jour</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Groupe</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(showAllSeances ? seances : seances.filter(s => s.nomClasse === selectedClasse))
                        .map(seance => {
                            const matiere = getMatiereInfo(seance.idMatiere);
                            return (
                                <tr key={seance.id}>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{seance.id}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{seance.nomClasse}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{matiere.nom_cour}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{matiere.type_cour}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{seance.nomProf}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{seance.nomSalle}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{normalizeHeure(seance.heureDebut)}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{normalizeHeure(seance.heureFin)}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{seance.jour}</td>
                                    <td style={{ border: '1px solid black', padding: '10px' }}>{seance.groupe || '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {seances.length === 0 && (
                    <p style={{ marginTop: '20px', color: '#888' }}>Aucune séance trouvée.</p>
                )}
            </div>
        </div>
    );
};

export default EmploisPage;