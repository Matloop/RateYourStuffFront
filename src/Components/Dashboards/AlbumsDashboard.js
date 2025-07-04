import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import MediaList from '../Common/MediaList';
import MediaDetail from '../Common/MediaDetail';
import SearchBar from '../Common/SearchBar';
import SearchResults from '../Common/SearchResults';

// --- ADICIONADO DE VOLTA: Função helper para validar o link do Spotify ---
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
  const [collection, setCollection] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- ADICIONADO DE VOLTA: Estados para o painel de importação por link ---
  const [isUrlPanelVisible, setIsUrlPanelVisible] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  // Normaliza os dados de um álbum para o formato padrão
  const normalizeData = (item) => ({
    id: item.id,
    apiId: item.spotifyId || item.id, // Garante que apiId exista
    title: item.name,
    subtitle: item.artistName || (item.artists?.map(a => a.name).join(', ')),
    imageUrl: item.imageUrl || item.images?.[0]?.url,
    meta: `Lançado em: ${item.releaseDate || item.release_date}`,
    ...item
  });

  const fetchCollection = useCallback(async () => {
    try {
      const response = await apiClient.get('/albums');
      setCollection(response.data.map(normalizeData));
    } catch (error) { toast.error('Falha ao carregar a coleção de álbuns.'); }
  }, []);

  useEffect(() => { fetchCollection(); }, [fetchCollection]);
  
  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await apiClient.get(`/search/albums?q=${encodeURIComponent(query)}`);
      // Normaliza os resultados da busca para o componente SearchResults
      const normalizedResults = response.data.map(item => ({
        apiId: item.id,
        title: item.name,
        subtitle: item.artists.map(a => a.name).join(', '),
        imageUrl: item.images?.[0]?.url
      }));
      setSearchResults(normalizedResults);
    } catch (error) { toast.error("Falha ao buscar álbuns."); }
    finally { setIsSearching(false); }
  };

  const handleImport = async (spotifyId) => {
    if (collection.some(item => item.apiId === spotifyId)) {
      toast.warn("Este álbum já está na sua coleção.");
      return;
    }
    const toastId = toast.loading("Importando álbum...");
    try {
      await apiClient.post(`/import/albums/${spotifyId}`);
      toast.update(toastId, { render: "Álbum importado!", type: "success", isLoading: false, autoClose: 3000 });
      setSearchResults([]);
      fetchCollection();
    } catch (error) { toast.update(toastId, { render: "Falha ao importar.", type: "error", isLoading: false, autoClose: 5000 }); }
  };

  // --- ADICIONADO DE VOLTA: Handler para a importação por URL ---
  const handleConfirmImportByUrl = async () => {
    if (!isSpotifyAlbumUrl(importUrl)) {
        toast.error("Por favor, insira um link de álbum do Spotify válido.");
        return;
    }

    const importToastId = toast.loading("Importando álbum pelo link...");
    try {
      // Seu backend precisa de um endpoint que aceite uma URL
      await apiClient.post('import/album-by-url', { url: importUrl });
      toast.update(importToastId, { render: "Álbum importado com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
      setImportUrl(''); // Limpa o input
      setIsUrlPanelVisible(false); // Fecha o painel
      fetchCollection(); // Atualiza a coleção
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Falha ao importar o álbum.";
      toast.update(importToastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 5000 });
    }
  };


  // Futuramente, você pode implementar a lógica de scores aqui
  const [scores, setScores] = useState([]);
  const handleScoreSubmit = async (scoreData) => { /* lógica de envio */ };
  
  if (selectedItem) {
    return <MediaDetail item={selectedItem} onBack={() => setSelectedItem(null)} scores={scores} onScoreSubmit={handleScoreSubmit} />;
  }

  return (
    <>
      {/* --- ADICIONADO DE VOLTA: Botão e painel de importação por URL --- */}
      <div className="dashboard-actions">
        <button 
          className="import-link-button" 
          onClick={() => setIsUrlPanelVisible(prev => !prev)}
        >
          {isUrlPanelVisible ? 'Cancelar Importação por Link' : 'Importar por Link do Spotify'}
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
        <button
          className="confirm-button"
          onClick={handleConfirmImportByUrl}
          disabled={!importUrl.trim()}
        >
          Confirmar
        </button>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Buscar por álbum no Spotify..." />
      {isSearching && <p>Buscando...</p>}
      <SearchResults results={searchResults} onImport={handleImport} />
      {searchResults.length > 0 && <hr className="divider" />}
      <h3>Sua Coleção de Álbuns</h3>
      <MediaList items={collection} onItemSelect={setSelectedItem} emptyMessage="Sua coleção de álbuns está vazia." />
    </>
  );
};

export default AlbumsDashboard;