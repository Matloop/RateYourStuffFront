import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token); 
      navigate('/'); 
    } else {
      console.error("Nenhum token encontrado no callback.");
      navigate('/login'); 
    }
  }, [login, location, navigate]);

  return <div>Autenticando...</div>;
};

export default AuthCallback;