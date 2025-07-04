import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import MediaList from '../Common/MediaList';
import MediaDetail from '../Common/MediaDetail';
import SearchBar from '../Common/SearchBar';
import SearchResults from '../Common/SearchResults';

const MoviesDashboard = () => {
  const [collection, setCollection] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Normaliza os dados de um filme para o formato padrão
  const normalizeData = (item) => ({
    id: item.id, // ID do seu banco
    apiId: item.tmdbId || item.id, // ID da API externa (TMDB)
    title: item.title,
    subtitle: item.director || `Lançado em ${new Date(item.release_date).getFullYear()}`,
    imageUrl: item.posterUrl || `https://image.tmdb.org/t/p/w500${item.poster_path}`,
    meta: item.overview,
    ...item
  });
  
  const fetchCollection = useCallback(async () => {
    try {
      const response = await apiClient.get('/movies');
      setCollection(response.data.map(normalizeData));
    } catch (error) { toast.error('Falha ao carregar a coleção de filmes.'); }
  }, []);

  useEffect(() => { fetchCollection(); }, [fetchCollection]);
  
  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await apiClient.get(`/search/movies?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.map(normalizeData));
    } catch (error) { toast.error("Falha ao buscar filmes."); }
    finally { setIsSearching(false); }
  };

  const handleImport = async (tmdbId) => {
    if (collection.some(item => item.apiId === tmdbId)) {
      toast.warn("Este filme já está na sua coleção.");
      return;
    }
    const toastId = toast.loading("Importando filme...");
    try {
      await apiClient.post(`/import/movies/${tmdbId}`);
      toast.update(toastId, { render: "Filme importado!", type: "success", isLoading: false, autoClose: 3000 });
      setSearchResults([]);
      fetchCollection();
    } catch (error) { toast.update(toastId, { render: "Falha ao importar.", type: "error", isLoading: false, autoClose: 5000 }); }
  };

  const [scores, setScores] = useState([]);
  const handleScoreSubmit = async (scoreData) => { /* lógica de envio */ };

  if (selectedItem) {
    return <MediaDetail item={selectedItem} onBack={() => setSelectedItem(null)} scores={scores} onScoreSubmit={handleScoreSubmit} />;
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} placeholder="Buscar por um filme..." />
      {isSearching && <p>Buscando...</p>}
      <SearchResults results={searchResults} onImport={handleImport} />
      {searchResults.length > 0 && <hr className="divider" />}
      <h3>Sua Coleção de Filmes</h3>
      <MediaList items={collection} onItemSelect={setSelectedItem} emptyMessage="Sua coleção de filmes está vazia." />
    </>
  );
};

export default MoviesDashboard;