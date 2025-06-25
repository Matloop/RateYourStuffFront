import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Importe seus componentes de página/autenticação
import Dashboard from './Components/Dashboard'; 
import Login from './Components/Login';
import AuthCallback from './Components/AuthCallback';
import './App.css'; 

// Um componente wrapper para proteger rotas
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

// O componente App principal com o conteúdo
function AppContent() {
  const { user, logout } = useAuth(); // Pegamos a função logout do nosso contexto

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rate Your Stuff</h1>
        {/* Renderiza as informações do usuário e o botão de logout apenas se o usuário estiver logado */}
        {user && (
          <div className="user-info">
            <span>Olá, {user.name}</span>
            {/* BOTÃO DE LOGOUT ADICIONADO AQUI */}
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
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;