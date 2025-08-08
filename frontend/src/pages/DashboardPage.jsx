// src/pages/DashboardPage.jsx - Version mise à jour
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

    const handleGenerateSchedules = () => {
        alert('Génération des emplois du temps - Fonctionnalité à venir');
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
                        <h3>Statistiques</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Nombre d'utilisateurs:</strong> {dashboardData.userCount || 0}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Nombre de classes:</strong> {dashboardData.classeCount || 0}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Nombre de salles:</strong> {dashboardData.salleCount || 0}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Nombre de matières:</strong> {dashboardData.matiereCount || 0}
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleGenerateSchedules}
                                style={{ padding: '10px 20px', fontSize: '16px' }}
                            >
                                Générer les emplois
                            </button>
                        </div>
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