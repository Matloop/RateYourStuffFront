import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ScoreForm = ({ mediaApiId, onSubmit }) => {
  const [value, setValue] = useState(50);
  const [reviewText, setReviewText] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
    
    // Objeto de dados genérico para a avaliação
    const scoreData = {
      value: parseInt(value, 10),
      reviewText,
      mediaApiId: mediaApiId, // ID genérico da mídia
      userId: user.id,
    };
    
    onSubmit(scoreData);
    // Limpa o formulário após o envio
    setValue(50);
    setReviewText('');
  };

  return (
    <form onSubmit={handleSubmit} className="score-form">
      <h4>Adicionar sua avaliação</h4>
      <div className="form-group">
        <label htmlFor="score-value">Nota (0-100): {value}</label>
        <input
          id="score-value"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="review-text">Comentário (opcional):</label>
        <textarea
          id="review-text"
          rows="3"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
      <button type="submit">Enviar Avaliação</button>
    </form>
  );
};

export default ScoreForm;