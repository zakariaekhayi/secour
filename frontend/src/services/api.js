// src/services/api.js - Version mise à jour
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    // Auth
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        return response.json();
    },

    getDashboardData: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.json();
    },

    // Classes
    getAllClasses: async () => {
        const response = await fetch(`${API_BASE_URL}/classes`);
        return response.json();
    },

    getClasseByNom: async (nom) => {
        const response = await fetch(`${API_BASE_URL}/classes/${nom}`);
        return response.json();
    },

    createClasse: async (classe) => {
        const response = await fetch(`${API_BASE_URL}/classes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(classe)
        });
        return response.json();
    },

    updateClasse: async (nom, classe) => {
        const response = await fetch(`${API_BASE_URL}/classes/${nom}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(classe)
        });
        return response.json();
    },

    deleteClasse: async (nom) => {
        const response = await fetch(`${API_BASE_URL}/classes/${nom}`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    // Salles
    getAllSalles: async () => {
        const response = await fetch(`${API_BASE_URL}/salles`);
        return response.json();
    },

    getSalleByNom: async (nom) => {
        const response = await fetch(`${API_BASE_URL}/salles/${nom}`);
        return response.json();
    },

    createSalle: async (salle) => {
        const response = await fetch(`${API_BASE_URL}/salles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salle)
        });
        return response.json();
    },

    updateSalle: async (nom, salle) => {
        const response = await fetch(`${API_BASE_URL}/salles/${nom}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salle)
        });
        return response.json();
    },

    deleteSalle: async (nom) => {
        const response = await fetch(`${API_BASE_URL}/salles/${nom}`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    // Matières
    getAllMatieres: async () => {
        const response = await fetch(`${API_BASE_URL}/matieres`);
        return response.json();
    },

    getMatiereById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/matieres/${id}`);
        return response.json();
    },

    createMatiere: async (matiere) => {
        const response = await fetch(`${API_BASE_URL}/matieres`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matiere)
        });
        return response.json();
    },

    updateMatiere: async (id, matiere) => {
        const response = await fetch(`${API_BASE_URL}/matieres/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matiere)
        });
        return response.json();
    },

    deleteMatiere: async (id) => {
        const response = await fetch(`${API_BASE_URL}/matieres/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    // Séances
    getAllSeances: async () => {
        const response = await fetch(`${API_BASE_URL}/seances`);
        return response.json();
    },

    getSeanceById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/seances/${id}`);
        return response.json();
    },

    getSeancesByClasse: async (nomClasse) => {
        const response = await fetch(`${API_BASE_URL}/seances/classe/${nomClasse}`);
        return response.json();
    },

    createSeance: async (seance) => {
        const response = await fetch(`${API_BASE_URL}/seances`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(seance)
        });
        return response.json();
    },

    updateSeance: async (id, seance) => {
        const response = await fetch(`${API_BASE_URL}/seances/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(seance)
        });
        return response.json();
    },

    deleteSeance: async (id) => {
        const response = await fetch(`${API_BASE_URL}/seances/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    }
};