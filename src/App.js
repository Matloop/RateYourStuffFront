import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import apiClient from './api/axiosConfig'; // Importamos nosso cliente axios configurado

// Importe seus componentes de página/autenticação
import Dashboard from './Components/Dashboard'; // Criaremos este componente
import Login from './Components/Login';
import AuthCallback from './Components/AuthCallback';
import './App.css'; // Mantenha seu CSS incrível

// Um componente wrapper para proteger rotas
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

// O componente App principal
function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rate Your Stuff</h1>
        {user && (
          <div className="user-info">
            <span>Olá, {user.name}</span>
            <button onClick={logout} className="logout-button">Sair</button>
          </div>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// O ponto de entrada que envolve tudo com os providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;