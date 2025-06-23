import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScoreForm from './ScoreForm';

const API_URL = 'http://localhost:8080/api';

const AlbumDetail = ({ album, onBack }) => {
  const [scores, setScores] = useState([]);

  // Busca as avaliações usando o ID do nosso banco de dados (Long)
  const fetchScores = async () => {
    try {
      const response = await axios.get(`${API_URL}/albums/${album.id}/scores`);
      setScores(response.data);
    } catch (error) {
      console.error(`Erro ao buscar avaliações para o álbum ${album.id}:`, error);
    }
  };

  useEffect(() => {
    if (album && album.id) {
        fetchScores();
    }
  }, [album]);

  const handleScoreSubmit = async (scoreData) => {
    try {
      await axios.post(`${API_URL}/scores`, scoreData);
      alert('Avaliação enviada com sucesso!');
      fetchScores(); // Atualiza a lista de avaliações
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Falha ao enviar avaliação.');
    }
  };

  if (!album) {
    return <div>Carregando detalhes do álbum...</div>;
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
        {/* CORREÇÃO: Passa o spotifyId do álbum para o formulário, que é a informação que o backend precisa para criar um score */}
        <ScoreForm albumSpotifyId={album.spotifyId} onSubmit={handleScoreSubmit} />
        
        <div className="scores-list">
          {scores.length > 0 ? (
            scores.map((score) => (
              <div key={score.id} className="score-item">
                <div className="score-value">{score.value}</div>
                <div className="score-content">
                  <p><strong>{score.userName || 'Usuário Anônimo'}:</strong> {score.reviewText}</p>
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