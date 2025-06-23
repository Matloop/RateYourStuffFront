import React, { useState } from 'react';

// CORREÇÃO: Recebe 'albumSpotifyId' como prop
const ScoreForm = ({ albumSpotifyId, onSubmit }) => {
  const [value, setValue] = useState(50);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!albumSpotifyId) {
        alert("Erro: ID do álbum não encontrado.");
        return;
    }
    
    // O objeto de dados que será enviado como JSON para o backend
    const scoreData = {
      value: parseInt(value, 10),
      reviewText,
      // CORREÇÃO: O nome do campo agora é 'spotifyAlbumId' e ele usa o valor recebido via props
      spotifyAlbumId: albumSpotifyId, 
      userId: 1, // Mantendo o usuário fixo para teste
    };
    
    onSubmit(scoreData);
    setReviewText('');
    setValue(50); // Opcional: reseta o slider
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