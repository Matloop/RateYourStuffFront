// File: src/Components/Dashboard.js

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { toast } from 'react-toastify';

// Importação dos componentes filhos
import AlbumList from './AlbumList';
import AlbumDetail from './AlbumDetail';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

// Função helper para validar a URL do Spotify no lado do cliente
const isSpotifyAlbumUrl = (text) => {
  if (!text) return false;
  try {
    const url = new URL(text);
    return url.hostname === 'open.spotify.com' && url.pathname.includes('/album/');
  } catch (_) {
    return false;
  }
};

const Dashboard = () => {
  // --- Estados do Componente ---
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // --- Estados para o PAINEL de importação (substituindo o modal) ---
  const [isUrlPanelVisible, setIsUrlPanelVisible] = useState(false); // NOVO ESTADO
  const [importUrl, setImportUrl] = useState('');

  // --- Funções de Lógica ---
  const fetchAlbums = useCallback(async () => {
    try {
      const response = await apiClient.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns da coleção:', error);
      toast.error('Não foi possível carregar sua coleção.');
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Função para a busca por texto (sem alterações)
  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await apiClient.get(`/search/albums?q=${encodeURIComponent(query)}`);
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        toast.info("Nenhum resultado encontrado para sua busca.");
      }
    } catch (error) {
      console.error("Erro na busca de álbuns:", error);
      toast.error("Falha ao buscar álbuns.");
    } finally {
      setIsSearching(false);
    }
  };

  // Função para importar a partir dos resultados da busca (sem alterações)
  const handleImportFromSearch = async (spotifyId) => {
    if (albums.some(album => album.spotifyId === spotifyId)) {
      toast.warn("Este álbum já está na sua coleção.");
      return;
    }
    const importToastId = toast.loading("Importando álbum...");
    try {
      await apiClient.post(`/import/albums/${spotifyId}`);
      toast.update(importToastId, { render: "Álbum importado!", type: "success", isLoading: false, autoClose: 3000 });
      setSearchResults([]);
      fetchAlbums();
    } catch (error) {
      toast.update(importToastId, { render: "Falha ao importar.", type: "error", isLoading: false, autoClose: 5000 });
    }
  };

  // Função chamada pelo botão "Confirmar" do painel de URL (sem alterações na lógica)
  const handleConfirmImportByUrl = async () => {
    if (!isSpotifyAlbumUrl(importUrl)) {
        toast.error("Por favor, insira um link de álbum do Spotify válido.");
        return;
    }

    const importToastId = toast.loading("Importando álbum pelo link...");
    try {
      await apiClient.post('import/album-by-url', { url: importUrl });
      toast.update(importToastId, { render: "Álbum importado com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
      setImportUrl('');
      setIsUrlPanelVisible(false); // Fecha o painel após o sucesso
      fetchAlbums();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Falha ao importar o álbum.";
      toast.update(importToastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 5000 });
    }
  };


  // --- Renderização do Componente ---
  if (selectedAlbum) {
    return <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  return (
    <>
      <div className="dashboard-actions">
        {/* Este botão agora abre e fecha o painel */}
        <button 
          className="import-link-button" 
          onClick={() => setIsUrlPanelVisible(prev => !prev)} // Alterna a visibilidade
        >
          {isUrlPanelVisible ? 'Cancelar Importação por Link' : 'Importar por Link'}
        </button>
      </div>
      
      {/* --- NOVO PAINEL DE IMPORTAÇÃO POR URL --- */}
      {/* O painel é renderizado condicionalmente com base no estado */}
      <div className={`url-import-panel ${isUrlPanelVisible ? 'visible' : ''}`}>
        <input
          type="url"
          className="url-input"
          placeholder="Cole aqui o link do álbum do Spotify..."
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
        />
        <button
          className="confirm-button"
          onClick={handleConfirmImportByUrl}
          disabled={!importUrl.trim()}
        >
          Confirmar
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />
      
      {isSearching && <p>Buscando...</p>}
      
      <SearchResults results={searchResults} onImport={handleImportFromSearch} />
      
      {searchResults.length > 0 && <hr className="divider" />}

      <h3>Sua Coleção</h3>
      <AlbumList albums={albums} onAlbumSelect={setSelectedAlbum} />
    </>
  );
};

export default Dashboard;