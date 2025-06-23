import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import AlbumList from './AlbumList';
import AlbumDetail from './AlbumDetail';
import SearchBar from './SearchBar'; // Componente para a barra de busca
import SearchResults from './SearchResults'; // Componente para exibir os resultados

const Dashboard = () => {
  // Estado para os álbuns salvos na sua coleção
  const [albums, setAlbums] = useState([]);
  // Estado para o álbum selecionado para ver os detalhes
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  // Estado para os resultados da busca da API do Spotify
  const [searchResults, setSearchResults] = useState([]);
  // Estado para mostrar um feedback de "carregando" durante a busca
  const [isSearching, setIsSearching] = useState(false);

  // Função para buscar os álbuns da sua coleção pessoal
  const fetchAlbums = async () => {
    try {
      const response = await apiClient.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns da coleção:', error);
    }
  };

  // Busca a coleção inicial quando o componente é montado
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Função chamada pelo SearchBar quando o usuário faz uma busca
  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchResults([]); // Limpa resultados antigos
    try {
      const response = await apiClient.get(`/search/albums?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Falha ao buscar álbuns.");
    } finally {
      setIsSearching(false); // Termina o estado de "buscando"
    }
  };
  
  // Função chamada pelo SearchResults quando o usuário clica em "+ Importar"
  // Reutiliza o endpoint de importação que já tínhamos
  const handleImportFromSearch = async (spotifyId) => {
    // Verifica se o álbum já foi importado para evitar duplicatas
    if (albums.some(album => album.spotifyId === spotifyId)) {
      alert("Este álbum já está na sua coleção.");
      return;
    }
    
    try {
      alert(`Importando álbum...`);
      await apiClient.post(`/import/albums/${spotifyId}`);
      alert('Álbum importado com sucesso!');
      setSearchResults([]); // Limpa os resultados da busca após importar
      fetchAlbums(); // Atualiza a lista de álbuns da sua coleção
    } catch (error) {
      console.error('Erro ao importar álbum:', error);
      alert("Falha ao importar o álbum.");
    }
  };

  // Se um álbum está selecionado, mostra a tela de detalhes
  if (selectedAlbum) {
    return <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  // Senão, mostra a tela principal do Dashboard
  return (
    <>
      <SearchBar onSearch={handleSearch} />
      
      {isSearching && <p>Buscando...</p>}
      
      <SearchResults results={searchResults} onImport={handleImportFromSearch} />
      
      {/* Adiciona um divisor visual se houver resultados de busca */}
      {searchResults.length > 0 && <hr className="divider" />}

      <h3>Sua Coleção</h3>
      <AlbumList albums={albums} onAlbumSelect={setSelectedAlbum} />
    </>
  );
};

export default Dashboard;