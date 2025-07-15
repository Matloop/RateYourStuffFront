// Arquivo: src/components/Common/ScoreForm.js (VERSÃO CORRIGIDA)

import React, { useState } from 'react';

const ScoreForm = ({ mediaApiId, onSubmit }) => {
  const [value, setValue] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log para debug - verificar se o mediaApiId está chegando corretamente
  console.log('[DEBUG ScoreForm] mediaApiId recebido:', mediaApiId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mediaApiId) {
      console.error('[ScoreForm] mediaApiId está undefined/null');
      return;
    }

    if (!value || value < 0 || value > 100) {
      alert('Por favor, insira uma nota entre 0 e 100');
      return;
    }

    setIsSubmitting(true);

    // Preparar os dados no formato que o backend espera
    const scoreData = {
      value: parseInt(value), // Converter para inteiro
      reviewText: reviewText || '', // Se vazio, enviar string vazia
      userId: 1, // TODO: Pegar do contexto de autenticação
      spotifyAlbumId: mediaApiId // CORRIGIDO: usar o nome correto do campo
    };

    console.log('[DEBUG ScoreForm] Enviando dados:', scoreData);

    try {
      await onSubmit(scoreData);
      // Limpar o formulário após sucesso
      setValue('');
      setReviewText('');
    } catch (error) {
      console.error('[ScoreForm] Erro ao enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="score-form">
      <div className="form-group">
        <label htmlFor="score-value">Nota (0-100):</label>
        <input
          id="score-value"
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="review-text">Comentário (opcional):</label>
        <textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          disabled={isSubmitting}
          placeholder="Escreva sua opinião sobre este álbum..."
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting || !value}
        className="submit-button"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
};

export default ScoreForm;