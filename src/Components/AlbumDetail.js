import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // Usando nosso cliente axios configurado
import ScoreForm from './ScoreForm';

const AlbumDetail = ({ album, onBack }) => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  const fetchScores = async () => {
    if (!album || !album.id) return;
    try {
      // Usa o ID do nosso banco (Long) para buscar as avaliações
      const response = await apiClient.get(`/albums/${album.id}/scores`);
      setScores(response.data);
    } catch (err) {
      setError('Não foi possível carregar as avaliações.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [album]);

  const handleScoreSubmit = async (scoreData) => {
    try {
      // Envia os dados para o endpoint de criação de score
      await apiClient.post('/scores', scoreData);
      alert('Avaliação enviada com sucesso!');
      fetchScores(); // Re-busca as avaliações para atualizar a lista
    } catch (err) {
      // Captura e exibe uma mensagem de erro mais detalhada do backend
      const errorMessage = err.response?.data?.message || 'Falha ao enviar avaliação. Verifique os dados e tente novamente.';
      alert(errorMessage);
      console.error('Erro ao enviar avaliação:', err.response || err);
    }
  };

  if (!album) {
    return <div>Carregando...</div>;
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
        {/* CORREÇÃO: Passa o spotifyId do álbum para o formulário. */}
        <ScoreForm albumSpotifyId={album.spotifyId} onSubmit={handleScoreSubmit} />
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="scores-list">
          {scores.length > 0 ? (
            scores.map((score) => (
              <div key={score.id} className="score-item">
                <div className="score-value">{score.value}</div>
                <div className="score-content">
                  <p><strong>{score.userName || 'Usuário'}:</strong> {score.reviewText}</p>
                  <small>{new Date(score.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))
          ) : (
            <p>Seja o primeiro a avaliar este álbum!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;