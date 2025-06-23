import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // A base da sua API
});

// Interceptor de Requisição: Adiciona o token ao cabeçalho antes de cada chamada
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;