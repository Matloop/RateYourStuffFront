// Arquivo: src/components/Common/MediaDetail.js (VERSÃO CORRIGIDA E COMPLETA)

import React from 'react';
import ScoreForm from './ScoreForm';

const MediaDetail = ({ item, onBack, scores, onScoreSubmit, isLoadingScores }) => {
  // Debug logs para verificar o que está chegando
  console.log("[DEBUG MediaDetail] item completo:", item);
  console.log("[DEBUG MediaDetail] item.apiId:", item?.apiId);
  console.log("[DEBUG MediaDetail] item.spotifyId:", item?.spotifyId);
  console.log("[DEBUG MediaDetail] Todas as propriedades do item:", Object.keys(item || {}));

  if (!item) return null;

  // Vamos tentar diferentes possibilidades para o spotifyId
  const spotifyId = item.apiId || item.spotifyId || item.externalId;
  
  console.log("[DEBUG MediaDetail] spotifyId final escolhido:", spotifyId);

  const renderScoresList = () => {
    if (isLoadingScores) {
      return <p>Carregando avaliações...</p>;
    }
    if (!scores || scores.length === 0) {
      return <p className="rated-message">Seja o primeiro a avaliar!</p>;
    }
    return (
      <div className="scores-list">
        {scores.map((score) => (
          <div key={score.id} className="score-item">
            <div className="score-value">{score.value}</div>
            <div className="score-content">
              <p><strong>{score.userName || 'Anônimo'}:</strong> {score.reviewText}</p>
              <small>{new Date(score.createdAt).toLocaleString('pt-BR')}</small>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="detail-view">
      <header className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <h1>{item.title}</h1>
        <p className="subtitle">{item.subtitle}</p>
      </header>
      
      <main className="detail-content">
        <div className="media-info">
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="media-image"
            />
          )}
          <div className="media-details">
            <p><strong>Título:</strong> {item.title}</p>
            <p><strong>Artista:</strong> {item.subtitle}</p>
            {item.meta && <p><strong>Info:</strong> {item.meta}</p>}
            <p><strong>Spotify ID:</strong> {spotifyId}</p>
          </div>
        </div>
        
        <div className="scores-section">
          <h3>Avaliações</h3>
          
          {/* Verificar se temos um spotifyId válido antes de renderizar o form */}
          {spotifyId ? (
            <ScoreForm 
              mediaApiId={spotifyId} 
              onSubmit={onScoreSubmit} 
            />
          ) : (
            <p className="error-message">
              Erro: Não foi possível identificar o ID do Spotify para este álbum.
              <br />
              Dados disponíveis: {JSON.stringify(item, null, 2)}
            </p>
          )}
          
          <div className="scores-container">
            {renderScoresList()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MediaDetail;