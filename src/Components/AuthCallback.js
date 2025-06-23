import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extrai o token do parâmetro 'token' da URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token); // Salva o token no nosso contexto (e no localStorage)
      navigate('/'); // Redireciona para a página principal
    } else {
      // Lida com o caso de erro onde não há token
      console.error("Nenhum token encontrado no callback.");
      navigate('/login'); // Redireciona de volta para a página de login
    }
  }, [login, location, navigate]);

  return <div>Autenticando...</div>;
};

export default AuthCallback;