import React from 'react';

// URL do endpoint de autorização do Google no seu backend
const GOOGLE_AUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

const Login = () => {
  return (
    <div className="login-container">
      <h2>Bem-vindo ao Rate Your Stuff</h2>
      <p>Faça login com sua conta do Google para começar.</p>
      {/* Este não é um botão de formulário, é um link que redireciona o navegador */}
      <a href={GOOGLE_AUTH_URL} className="login-button">
        Login com Google
      </a>
    </div>
  );
};

export default Login;