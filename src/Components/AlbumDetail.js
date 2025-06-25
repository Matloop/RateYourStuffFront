import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import ScoreForm from './ScoreForm';
import { toast } from 'react-toastify';

const AlbumDetail = ({ album, onBack }) => {
  const [scores, setScores] = useState([]); // Garante que o estado inicial seja um array vazio
  const [isLoading, setIsLoading] = useState(true); // Adiciona um estado de carregamento
  const [error, setError] = useState('');

  // Usamos useCallback para memorizar a função e evitar recriações desnecessárias
  // Isso é uma boa prática, especialmente quando a função é usada em um useEffect.
  const fetchScores = useCallback(async () => {
    // Garante que não façamos chamadas desnecessárias se não houver um álbum
    if (!album || !album.id) {
      setIsLoading(false);
      return;
    }

    console.log(`Buscando avaliações para o álbum ID: ${album.id}`);
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.get(`/albums/${album.id}/scores`);
      
      // PONTO DE VERIFICAÇÃO 1: Verifique o que a API está realmente retornando
      console.log('Resposta da API de scores:', response.data);

      // Garante que estamos sempre trabalhando com um array
      if (Array.isArray(response.data)) {
        setScores(response.data);
      } else {
        // Se a resposta não for um array, logamos um aviso e definimos como vazio
        console.warn('A resposta da API de scores não é um array. Definindo como vazio.');
        setScores([]);
      }
    } catch (err) {
      setError('Não foi possível carregar as avaliações.');
      console.error('Erro ao buscar avaliações:', err);
      setScores([]); // Limpa scores em caso de erro
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  }, [album]); // A dependência é o objeto 'album'

  // O useEffect agora chama a função memorizada
  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // Função para lidar com o envio de uma nova avaliação
  const handleScoreSubmit = async (scoreData) => {
    const submitToastId = toast.loading("Enviando sua avaliação...");
    try {
      await apiClient.post('/scores', scoreData);
      toast.update(submitToastId, {
        render: "Avaliação enviada com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      // Re-busca as avaliações para mostrar a nova imediatamente
      fetchScores();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao enviar avaliação.';
      toast.update(submitToastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error('Erro ao enviar avaliação:', err.response || err);
    }
  };

  // Renderização da seção da lista de avaliações
  const renderScoresList = () => {
    if (isLoading) {
      return <p>Carregando avaliações...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    if (scores.length === 0) {
      return <p className="rated-message">Seja o primeiro a avaliar este álbum!</p>;
    }
    
    return (
      <div className="scores-list">
        {scores.map((score) => (
          // PONTO DE VERIFICAÇÃO 2: Verifique os dados de cada 'score'
          // console.log('Renderizando score:', score);
          <div key={score.id} className="score-item">
            <div className="score-value">{score.value}</div>
            <div className="score-content">
              <p><strong>{score.userName || 'Usuário Anônimo'}:</strong> {score.reviewText}</p>
              <small>{new Date(score.createdAt).toLocaleString('pt-BR')}</small>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  if (!album) {
      return <div>Nenhum álbum selecionado.</div>;
  }

  return (
    <div className="album-detail-view">
      <button onClick={onBack} className="back-button">← Voltar para a lista</button>
      
      <div className="album-header">
        <img src={album.imageUrl} alt={album.name} />
        <div className="album-info">
          <h2>{album.name}</h2>
          <h3>{album.artistName}</h3>
          <p>Lançado em: {album.releaseDate}</p>
        </div>
      </div>

      <div className="scores-section">
        <h3>Avaliações</h3>
        <ScoreForm albumSpotifyId={album.spotifyId} onSubmit={handleScoreSubmit} />
        {renderScoresList()}
      </div>
    </div>
  );
};

export default AlbumDetail;