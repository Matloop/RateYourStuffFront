import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import AlbumList from './AlbumList';
import ImportForm from './ImportForm';
import AlbumDetail from './AlbumDetail';

const Dashboard = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const fetchAlbums = async () => {
    try {
      const response = await apiClient.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleImport = async (spotifyId) => {
    try {
      alert(`Importando álbum com ID: ${spotifyId}...`);
      await apiClient.post(`/import/albums/${spotifyId}`);
      alert('Álbum importado com sucesso!');
      fetchAlbums();
    } catch (error) {
      console.error('Erro ao importar álbum:', error);
    }
  };

  if (selectedAlbum) {
    return <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  return (
    <>
      <ImportForm onImport={handleImport} />
      <AlbumList albums={albums} onAlbumSelect={setSelectedAlbum} />
    </>
  );
};

export default Dashboard;