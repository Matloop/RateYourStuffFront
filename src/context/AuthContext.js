import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Você precisará instalar esta biblioteca

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Quando o token muda, decodifica para obter os dados do usuário
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser({
          name: decodedUser.name,
          email: decodedUser.sub, // 'sub' é o campo padrão para o subject (email)
          id: decodedUser.userId
        });
        localStorage.setItem('jwt_token', token);
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    } else {
      localStorage.removeItem('jwt_token');
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};