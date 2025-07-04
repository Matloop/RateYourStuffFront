import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importando os novos Dashboards e componentes de autenticação
import AlbumsDashboard from './Components/Dashboards/AlbumsDashboard';
import MoviesDashboard from './Components/Dashboards/MoviesDashboard';
import SeriesDashboard from './Components/Dashboards/SeriesDashboard';
import Login from './Components/Login';
import AuthCallback from './Components/AuthCallback';

// Importando o CSS principal
import './App.css';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

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

      {user && (
        <nav className="main-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Álbuns</NavLink>
          <NavLink to="/movies" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Filmes</NavLink>
          <NavLink to="/series" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Séries</NavLink>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Rotas Protegidas para cada Dashboard */}
          <Route path="/" element={<PrivateRoute><AlbumsDashboard /></PrivateRoute>} />
          <Route path="/movies" element={<PrivateRoute><MoviesDashboard /></PrivateRoute>} />
          <Route path="/series" element={<PrivateRoute><SeriesDashboard /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;