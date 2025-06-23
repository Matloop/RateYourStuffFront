import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumList from './Components/AlbumList';
import ImportForm from './Components/ImportForm';
import AlbumDetail from './Components/AlbumDetail';// Importe o novo componente
import './App.css';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Estado para controlar o álbum selecionado

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/albums`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      alert('Falha ao carregar os álbuns. Verifique se o backend está rodando.');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleImport = async (spotifyId) => {
    try {
      alert(`Importando álbum com ID: ${spotifyId}...`);
      await axios.post(`${API_URL}/import/albums/${spotifyId}`);
      alert('Álbum importado com sucesso!');
      fetchAlbums();
    } catch (error) {
      console.error('Erro ao importar álbum:', error);
      alert('Falha ao importar o álbum. Verifique o ID e se o backend está rodando.');
    }
  };

  // Função para lidar com o clique em um álbum na lista
  const handleAlbumSelect = (album) => {
    setSelectedAlbum(album);
  };

  // Função para voltar da tela de detalhes para a lista
  const handleBackToList = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rate Your Stuff</h1>
      </header>
      <main>
        {selectedAlbum ? (
          // Se um álbum estiver selecionado, renderiza a tela de detalhes
          <AlbumDetail album={selectedAlbum} onBack={handleBackToList} />
        ) : (
          // Caso contrário, renderiza a tela principal com a lista e o formulário
          <>
            <ImportForm onImport={handleImport} />
            <AlbumList albums={albums} onAlbumSelect={handleAlbumSelect} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;