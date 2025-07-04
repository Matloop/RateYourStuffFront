import React from 'react';
import ScoreForm from './ScoreForm'; // Será criado a seguir

// Componente genérico para a página de detalhes
const MediaDetail = ({ item, onBack, scores, onScoreSubmit }) => {
  if (!item) return null;

  const renderScoresList = () => {
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
      <button onClick={onBack} className="back-button">← Voltar</button>
      <header className="detail-header">
        <img src={item.imageUrl} alt={item.title} />
        <div className="detail-info">
          <h2>{item.title}</h2>
          <h3>{item.subtitle}</h3>
          {item.meta && <p>{item.meta}</p>}
        </div>
      </header>
      <main className="detail-content">
        <div className="scores-section">
          <h3>Avaliações</h3>
          <ScoreForm mediaApiId={item.apiId} onSubmit={onScoreSubmit} />
          {renderScoresList()}
        </div>
      </main>
    </div>
  );
};

export default MediaDetail;