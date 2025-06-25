import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// O formulário agora recebe a avaliação existente do usuário como uma prop opcional
const ScoreForm = ({ albumSpotifyId, onSubmit, existingScore }) => {
  const [value, setValue] = useState(50);
  const [reviewText, setReviewText] = useState('');
  const { user } = useAuth();

  // useEffect para preencher o formulário se uma avaliação já existir
  useEffect(() => {
    if (existingScore) {
      setValue(existingScore.value);
      setReviewText(existingScore.reviewText || '');
    } else {
      // Reseta o formulário se não houver avaliação (ex: ao navegar para outro álbum)
      setValue(50);
      setReviewText('');
    }
  }, [existingScore]); // Executa sempre que a avaliação existente mudar

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
    
    const scoreData = {
      value: parseInt(value, 10),
      reviewText,
      spotifyAlbumId: albumSpotifyId,
      userId: user.id,
    };
    
    onSubmit(scoreData);
  };

  // Decide se estamos no modo de edição
  const isEditing = !!existingScore;

  return (
    <form onSubmit={handleSubmit} className="score-form">
      <h4>{isEditing ? "Edite sua avaliação" : "Adicionar sua avaliação"}</h4>
      
      {/* Se o usuário já avaliou, mostra uma mensagem diferente */}
      {isEditing && (
        <p className="rated-message">Você já avaliou este álbum. Altere abaixo e clique em "Atualizar".</p>
      )}

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
      {/* O texto do botão muda dinamicamente */}
      <button type="submit">{isEditing ? "Atualizar Avaliação" : "Enviar Avaliação"}</button>
    </form>
  );
};

export default ScoreForm;