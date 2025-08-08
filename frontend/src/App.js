import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MatierePage from './pages/MatierePage';
import ProfesseurPage from './pages/ProfesseurPage';
import SallePage from './pages/SallePage';
import ClassePage from './pages/ClassePage';
import EmploiPage from './pages/EmploisPage';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (

        <Routes>
          <Route path="/" element={<DashboardPage user={user} onLogout={handleLogout} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/matieres" element={<MatierePage />} />
          <Route path="/salles" element={<SallePage />} />
          <Route path="/classes" element={<ClassePage />} />
          <Route path="/emplois" element={<EmploiPage />} />
        </Routes>

  );
}

export default App;