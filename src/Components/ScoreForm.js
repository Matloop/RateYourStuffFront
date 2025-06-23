import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa o hook de autenticação

const ScoreForm = ({ albumSpotifyId, onSubmit }) => {
  const [value, setValue] = useState(50);
  const [reviewText, setReviewText] = useState('');
  const { user } = useAuth(); // Pega os dados do usuário logado

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
        alert("Você precisa estar logado para avaliar.");
        return;
    }
    
    // Monta o objeto de dados para enviar ao backend
    const scoreData = {
      value: parseInt(value, 10),
      reviewText,
      // CORREÇÃO: O nome do campo é 'spotifyAlbumId' e usa a prop recebida.
      spotifyAlbumId: albumSpotifyId, 
      // CORREÇÃO: Usa o ID do usuário logado do contexto, em vez de um valor fixo.
      userId: user.id, 
    };
    
    onSubmit(scoreData);
    setReviewText('');
    setValue(50);
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