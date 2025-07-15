// Arquivo: src/Components/Dashboards/AlbumsDashboard.js (VERSÃO FINAL E CORRIGIDA)

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';

// Importação dos componentes filhos
import MediaList from '../Common/MediaList';
import MediaDetail from '../Common/MediaDetail';
import SearchBar from '../Common/SearchBar';
import SearchResults from '../Common/SearchResults';

// Função helper para validar o link do Spotify
const isSpotifyAlbumUrl = (text) => {
  if (!text) return false;
  try {
    const url = new URL(text);
    return url.hostname === 'open.spotify.com' && url.pathname.includes('/album/');
  } catch (_) {
    return false;
  }
};

const AlbumsDashboard = () => {
  // --- DECLARAÇÕES DE ESTADO (useState) ---
  const [collection, setCollection] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scores, setScores] = useState([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [isUrlPanelVisible, setIsUrlPanelVisible] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  // --- FUNÇÕES DE LÓGICA ---

  // CORREÇÃO DEFINITIVA: Esta função agora mapeia corretamente o campo 'spotifyId'
  // que vem do seu AlbumCardDTO do backend.
  const normalizeCollectionAlbum = useCallback((albumFromDb) => {
    // Para depuração final, vamos logar o que está acontecendo aqui.
    console.log("Normalizando álbum:", albumFromDb, " | Usando albumFromDb.spotifyId:", albumFromDb.spotifyId);
    
    return {
      id: albumFromDb.id,             // Este é o ID do banco (ex: 1, 2, 3)
      apiId: albumFromDb.spotifyId,   // Este DEVE ser o ID do Spotify (ex: "4aawy...")
      title: albumFromDb.name,
      subtitle: albumFromDb.artistName,
      imageUrl: albumFromDb.imageUrl,
      meta: `Lançado em: ${albumFromDb.releaseDate}`,
      ...albumFromDb,
    };
  }, []);

  // Busca a coleção de álbuns no seu backend
  const fetchCollection = useCallback(async () => {
    try {
      const response = await apiClient.get('/albums');
      const normalizedData = response.data.map(normalizeCollectionAlbum);
      setCollection(normalizedData);
    } catch (error) {
      toast.error('Falha ao carregar sua coleção de álbuns.');
    }
  }, [normalizeCollectionAlbum]);

  // Hook para buscar a coleção quando o componente montar
  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  // Lida com a busca de álbuns na API do Spotify
  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await apiClient.get(`/search/albums?q=${encodeURIComponent(query)}`);
      const normalizedResults = response.data.map((item) => ({
        apiId: item.id,
        title: item.name,
        subtitle: item.artists.map((a) => a.name).join(', '),
        imageUrl: item.images?.[0]?.url,
      }));
      setSearchResults(normalizedResults);
    } catch (error) {
      toast.error('Falha ao buscar álbuns no Spotify.');
    } finally {
      setIsSearching(false);
    }
  };

  // Lida com a importação de um álbum para a sua coleção
  const handleImport = async (spotifyId) => {
    if (collection.some((item) => item.apiId === spotifyId)) {
      toast.warn('Este álbum já está na sua coleção.');
      return;
    }
    const toastId = toast.loading('Importando álbum...');
    try {
      await apiClient.post(`/import/albums/${spotifyId}`);
      toast.update(toastId, { render: 'Álbum importado!', type: 'success', isLoading: false, autoClose: 3000 });
      setSearchResults([]);
      fetchCollection();
    } catch (error) {
      toast.update(toastId, { render: 'Falha ao importar.', type: 'error', isLoading: false, autoClose: 5000 });
    }
  };

  // Lida com a importação de um álbum via URL
  const handleConfirmImportByUrl = async () => {
    if (!isSpotifyAlbumUrl(importUrl)) {
      toast.error('Por favor, insira um link de álbum do Spotify válido.');
      return;
    }
    const toastId = toast.loading('Importando álbum pelo link...');
    try {
      await apiClient.post('/import/album-by-url', { url: importUrl });
      toast.update(toastId, { render: 'Álbum importado com sucesso!', type: 'success', isLoading: false, autoClose: 3000 });
      setImportUrl('');
      setIsUrlPanelVisible(false);
      fetchCollection();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Falha ao importar o álbum.';
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 5000 });
    }
  };

  // Seleciona um item para ver os detalhes e busca suas avaliações
  const handleSelectItem = useCallback(async (item) => {
    setSelectedItem(item);
    setIsLoadingScores(true);
    setScores([]);
    try {
      // Aqui usamos item.id (ID do banco) para buscar as avaliações, o que está correto.
      const response = await apiClient.get(`/albums/${item.id}/scores`);
      setScores(response.data);
    } catch (error) {
      toast.error('Não foi possível carregar as avaliações.');
    } finally {
      setIsLoadingScores(false);
    }
  }, []);

  // Envia uma nova avaliação para a API
  const handleScoreSubmit = async (scoreData) => {
    const toastId = toast.loading('Enviando avaliação...');
    try {
      await apiClient.post('/scores', scoreData);
      toast.update(toastId, { render: 'Avaliação enviada!', type: 'success', isLoading: false, autoClose: 3000 });
      if (selectedItem) {
        handleSelectItem(selectedItem);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Falha ao enviar avaliação.';
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 5000 });
      console.error('Erro em handleScoreSubmit:', error.response?.data || error);
    }
  };

  // --- RENDERIZAÇÃO DO COMPONENTE ---

  if (selectedItem) {
    return (
      <MediaDetail
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        scores={scores}
        onScoreSubmit={handleScoreSubmit}
        isLoadingScores={isLoadingScores}
      />
    );
  }

  return (
    <>
      <div className="dashboard-actions">
        <button className="import-link-button" onClick={() => setIsUrlPanelVisible((prev) => !prev)}>
          {isUrlPanelVisible ? 'Cancelar Importação por Link' : 'Importar Álbum por Link'}
        </button>
      </div>

      <div className={`url-import-panel ${isUrlPanelVisible ? 'visible' : ''}`}>
        <input
          type="url"
          className="url-input"
          placeholder="Cole aqui o link do álbum do Spotify..."
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
        />
        <button className="confirm-button" onClick={handleConfirmImportByUrl} disabled={!importUrl.trim()}>
          Confirmar Importação
        </button>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Buscar por álbum no Spotify..." />

      {isSearching && <p>Buscando...</p>}

      <SearchResults results={searchResults} onImport={handleImport} />

      {searchResults.length > 0 && <hr className="divider" />}

      <h3>Sua Coleção de Álbuns</h3>
      <MediaList
        items={collection}
        onItemSelect={handleSelectItem}
        emptyMessage="Sua coleção de álbuns está vazia. Importe um para começar!"
      />
    </>
  );
};

export default AlbumsDashboard;