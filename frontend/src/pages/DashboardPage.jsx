import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ClassePage from './ClassePage';
import SallePage from './SallePage';
import MatierePage from './MatierePage';
import EmploisPage from './EmploisPage';
import { api } from '../services/api';
import '../styles/DashboardPage.css';

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
                    <div className="stats-section">
                        <h3>📊 Statistiques</h3>
                        <div className="row g-4 mb-4">
                            <div className="col-lg-3 col-md-6">
                                <div className="card stat-card users">
                                    <div className="card-body">
                                        <div className="stat-number">
                                            {dashboardData.userCount || 0}
                                        </div>
                                        <p className="stat-label">Utilisateurs</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="card stat-card classes">
                                    <div className="card-body">
                                        <div className="stat-number">
                                            {dashboardData.classeCount || 0}
                                        </div>
                                        <p className="stat-label">Classes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="card stat-card salles">
                                    <div className="card-body">
                                        <div className="stat-number">
                                            {dashboardData.salleCount || 0}
                                        </div>
                                        <p className="stat-label">Salles</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="card stat-card matieres">
                                    <div className="card-body">
                                        <div className="stat-number">
                                            {dashboardData.matiereCount || 0}
                                        </div>
                                        <p className="stat-label">Matières</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="emplois-section">
                            <h3>🎓 Gestion des Emplois du Temps</h3>
                            <div className="action-buttons d-flex flex-wrap gap-3 mb-4">
                                <button
                                    onClick={handleGenerateSchedules}
                                    disabled={planningLoading}
                                    className="btn btn-generate d-flex align-items-center gap-2"
                                >
                                    {planningLoading ? (
                                        <>
                                            <div className="loading-spinner"></div>
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
                                    className="btn btn-clear d-flex align-items-center gap-2"
                                >
                                    {planningLoading ? (
                                        <>
                                            <div className="loading-spinner"></div>
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
                            <div className="card instructions-card">
                                <div className="card-body">
                                    <h4>📋 Instructions</h4>
                                    <ul className="mb-0">
                                        <li><strong>Générer les emplois :</strong> Exécute le script PHP pour créer automatiquement les plannings</li>
                                        <li><strong>Vider les emplois :</strong> Exécute le script PHP pour supprimer tous les emplois existants</li>
                                        <li><strong>Consultation :</strong> Utilisez l'onglet "Emplois" pour visualiser les plannings générés</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loading && currentPage === 'dashboard') {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Dashboard Admin</h2>
                    <div className="user-info">
                        <span className="username">
                            Bienvenue, {user?.nomComplet || user?.username}
                        </span>
                        <button onClick={onLogout} className="btn logout-btn">
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <div className="row g-0">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2">
                    <div className="dashboard-sidebar">
                        <h3 className="sidebar-title">Menu</h3>
                        <nav className="sidebar-nav">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <button
                                        onClick={() => handleMenuClick('dashboard')}
                                        className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                                    >
                                        <span className="me-2">📊</span>
                                        Dashboard
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        onClick={() => handleMenuClick('classes')}
                                        className={`nav-link ${currentPage === 'classes' ? 'active' : ''}`}
                                    >
                                        <span className="me-2">🎓</span>
                                        Classes
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        onClick={() => handleMenuClick('matieres')}
                                        className={`nav-link ${currentPage === 'matieres' ? 'active' : ''}`}
                                    >
                                        <span className="me-2">📚</span>
                                        Matières
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        onClick={() => handleMenuClick('salles')}
                                        className={`nav-link ${currentPage === 'salles' ? 'active' : ''}`}
                                    >
                                        <span className="me-2">🏫</span>
                                        Salles
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        onClick={() => handleMenuClick('emplois')}
                                        className={`nav-link ${currentPage === 'emplois' ? 'active' : ''}`}
                                    >
                                        <span className="me-2">📅</span>
                                        Emplois
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9 col-lg-10">
                    <main className="dashboard-main">
                        {renderCurrentPage()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;