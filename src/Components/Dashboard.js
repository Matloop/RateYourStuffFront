import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { toast } from 'react-toastify';

import AlbumList from './AlbumList';
import AlbumDetail from './AlbumDetail';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const Dashboard = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Função para buscar os álbuns da coleção do usuário no seu backend
  const fetchAlbums = async () => {
    try {
      const response = await apiClient.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns da coleção:', error);
      toast.error('Não foi possível carregar sua coleção.');
    }
  };

  // Executa fetchAlbums() uma vez quando o componente é montado
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Função que é passada para o SearchBar e chamada no 'submit' do formulário
  const handleSearch = async (query) => {
    console.log(`Iniciando busca no Dashboard com o termo: "${query}"`); // Ponto de depuração
    setIsSearching(true);
    setSearchResults([]); // Limpa resultados anteriores
    
    try {
      const response = await apiClient.get(`/search/albums?q=${query}`);
      
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        toast.info("Nenhum resultado encontrado para sua busca.");
      }
    } catch (error) {
      console.error("Erro na busca de álbuns:", error);
      toast.error("Falha ao buscar álbuns. Verifique o console.");
    } finally {
      setIsSearching(false);
    }
  };
  
  // Função para importar um álbum a partir dos resultados da busca
  const handleImportFromSearch = async (spotifyId) => {
    if (albums.some(album => album.spotifyId === spotifyId)) {
      toast.warn("Este álbum já está na sua coleção.");
      return;
    }
    
    const importToastId = toast.loading("Importando álbum...");
    try {
      await apiClient.post(`/import/albums/${spotifyId}`);
      toast.update(importToastId, { 
        render: "Álbum importado com sucesso!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      setSearchResults([]);
      fetchAlbums();
    } catch (error) {
      console.error('Erro ao importar álbum:', error);
      toast.update(importToastId, { 
        render: "Falha ao importar o álbum.", 
        type: "error", 
        isLoading: false, 
        autoClose: 5000 
      });
    }
  };

  // Se um álbum for selecionado, renderiza a tela de detalhes
  if (selectedAlbum) {
    return <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  // Renderização principal do Dashboard
  return (
    <>
      {/* O SearchBar recebe a função handleSearch via prop onSearch */}
      <SearchBar onSearch={handleSearch} />
      
      {isSearching && <p>Buscando...</p>}
      
      {/* SearchResults recebe os resultados e a função de importar */}
      <SearchResults results={searchResults} onImport={handleImportFromSearch} />
      
      {searchResults.length > 0 && <hr className="divider" />}

      <h3>Sua Coleção</h3>
      {/* AlbumList recebe os álbuns da coleção e a função para selecionar um */}
      <AlbumList albums={albums} onAlbumSelect={setSelectedAlbum} />
    </>
  );
};

export default Dashboard;