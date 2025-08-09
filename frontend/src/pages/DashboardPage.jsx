// src/pages/DashboardPage.jsx - Version simplifiée qui appelle directement les scripts PHP
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ClassePage from './ClassePage';
import SallePage from './SallePage';
import MatierePage from './MatierePage';
import EmploisPage from './EmploisPage';
import { api } from '../services/api';

const DashboardPage = ({ user, onLogout }) => {
    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [planningLoading, setPlanningLoading] = useState(false);

    // URL de base où se trouvent vos scripts PHP/*IMPORTANT : LE FOLDER  algorithme_emplois DOIT ETRE DANS HTDOC POUR QU'IL SOIT ACCECIBLE DANS LOCALHOST*//
    const PHP_BASE_URL = 'http://localhost/algorithme_emplois';//  // Ajustez selon votre configuration

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await api.getDashboardData();
                setDashboardData(data);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleMenuClick = (page) => {
        setCurrentPage(page);
    };

    const handleGenerateSchedules = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir générer tous les emplois du temps ? Cette action peut prendre du temps.')) {
            setPlanningLoading(true);
            try {
                const response = await fetch(`${PHP_BASE_URL}/generer.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (result.success) {
                    alert(`✅ Génération réussie!\n\n` +
                        `📊 Total séances créées: ${result.total_seances}\n` +
                        `📚 Classes traitées: ${Object.keys(result.resultats_par_classe || {}).length}\n\n` +
                        `${result.message}`);

                    // Rafraîchir les données du dashboard
                    const newData = await api.getDashboardData();
                    setDashboardData(newData);
                } else {
                    alert(`❌ Erreur lors de la génération:\n${result.error}`);
                }
            } catch (error) {
                console.error('Erreur lors de la génération:', error);
                alert(`❌ Erreur réseau lors de la génération:\n${error.message}`);
            } finally {
                setPlanningLoading(false);
            }
        }
    };

    const handleClearSchedules = async () => {
        if (window.confirm('⚠️ ATTENTION ! Cette action va supprimer TOUS les emplois du temps existants.\n\nÊtes-vous absolument sûr de vouloir continuer ?')) {
            setPlanningLoading(true);
            try {
                const response = await fetch(`${PHP_BASE_URL}/vider.php`, {
                    method: 'POST', // Ou DELETE selon votre serveur
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (result.success) {
                    alert(`✅ Suppression réussie!\n\n` +
                        `🗑️ Séances supprimées: ${result.seances_supprimees}\n\n` +
                        `${result.message}`);

                    // Rafraîchir les données du dashboard
                    const newData = await api.getDashboardData();
                    setDashboardData(newData);
                } else {
                    alert(`❌ Erreur lors de la suppression:\n${result.error}`);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert(`❌ Erreur réseau lors de la suppression:\n${error.message}`);
            } finally {
                setPlanningLoading(false);
            }
        }
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'classes':
                return <ClassePage />;
            case 'salles':
                return <SallePage />;
            case 'matieres':
                return <MatierePage />;
            case 'emplois':
                return <EmploisPage />;
            default:
                return (
                    <div>
                        <h3>📊 Statistiques</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                padding: '20px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#495057' }}>
                                    {dashboardData.userCount || 0}
                                </div>
                                <div style={{ color: '#6c757d' }}>Utilisateurs</div>
                            </div>

                            <div style={{
                                padding: '20px',
                                backgroundColor: '#e3f2fd',
                                borderRadius: '8px',
                                border: '1px solid #bbdefb'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                                    {dashboardData.classeCount || 0}
                                </div>
                                <div style={{ color: '#1565c0' }}>Classes</div>
                            </div>

                            <div style={{
                                padding: '20px',
                                backgroundColor: '#e8f5e8',
                                borderRadius: '8px',
                                border: '1px solid #c8e6c9'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                                    {dashboardData.salleCount || 0}
                                </div>
                                <div style={{ color: '#2e7d32' }}>Salles</div>
                            </div>

                            <div style={{
                                padding: '20px',
                                backgroundColor: '#fff3e0',
                                borderRadius: '8px',
                                border: '1px solid #ffcc02'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
                                    {dashboardData.matiereCount || 0}
                                </div>
                                <div style={{ color: '#ef6c00' }}>Matières</div>
                            </div>
                        </div>

                        <h3>🎓 Gestion des Emplois du Temps</h3>
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            marginBottom: '20px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={handleGenerateSchedules}
                                disabled={planningLoading}
                                style={{
                                    padding: '15px 25px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    backgroundColor: planningLoading ? '#cccccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: planningLoading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {planningLoading ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #ffffff',
                                            borderTop: '2px solid transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        Génération en cours...
                                    </>
                                ) : (
                                    <>
                                        📚 Générer les emplois du temps
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleClearSchedules}
                                disabled={planningLoading}
                                style={{
                                    padding: '15px 25px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    backgroundColor: planningLoading ? '#cccccc' : '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: planningLoading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {planningLoading ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #ffffff',
                                            borderTop: '2px solid transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        Suppression en cours...
                                    </>
                                ) : (
                                    <>
                                        🗑️ Vider tous les emplois
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Instructions d'utilisation */}
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '8px',
                            border: '1px solid #bbdefb',
                            marginTop: '20px'
                        }}>
                            <h4 style={{ color: '#1976d2', marginTop: '0' }}>📋 Instructions</h4>
                            <ul style={{ color: '#1565c0', lineHeight: '1.6' }}>
                                <li><strong>Générer les emplois :</strong> Exécute le script PHP pour créer automatiquement les plannings</li>
                                <li><strong>Vider les emplois :</strong> Exécute le script PHP pour supprimer tous les emplois existants</li>
                                <li><strong>Consultation :</strong> Utilisez l'onglet "Emplois" pour visualiser les plannings générés</li>
                            </ul>
                        </div>

                        {/* Style pour l'animation de rotation */}
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                );
        }
    };

    if (loading && currentPage === 'dashboard') {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <Header user={user} onLogout={onLogout} />
            <div style={{ display: 'flex' }}>
                <Sidebar onMenuClick={handleMenuClick} />
                <div style={{ flex: 1, padding: '20px' }}>
                    {renderCurrentPage()}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;