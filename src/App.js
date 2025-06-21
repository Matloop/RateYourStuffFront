import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumList from './Components/AlbumList';
import ImportForm from './Components/ImportForm';
import './App.css';

// URL base da nossa API Spring Boot
const API_URL = 'http://localhost:8080/api';

function App() {
  // Estado para armazenar a lista de álbuns
  const [albums, setAlbums] = useState([]);

  // Função para buscar os álbuns do nosso backend
  // Corresponde ao endpoint: GET /api/albums
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/albums`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      alert('Falha ao carregar os álbuns. Verifique se o backend está rodando.');
    }
  };

  // useEffect com array vazio `[]` executa a função uma vez, quando o componente é montado
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Função para lidar com a importação de um novo álbum
  // Corresponde ao endpoint: POST /api/import/albums/{spotifyId}
  const handleImport = async (spotifyId) => {
    try {
      // Mostra um feedback para o usuário
      alert(`Importando álbum com ID: ${spotifyId}...`);
      await axios.post(`${API_URL}/import/albums/${spotifyId}`);
      alert('Álbum importado com sucesso!');
      // Após importar, busca a lista de álbuns novamente para atualizar a tela
      fetchAlbums();
    } catch (error) {
      console.error('Erro ao importar álbum:', error);
      alert('Falha ao importar o álbum. Verifique o ID e se o backend está rodando.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rate Your Stuff</h1>
      </header>
      <main>
        <ImportForm onImport={handleImport} />
        <AlbumList albums={albums} />
      </main>
    </div>
  );
}

export default App;