import React, { useState } from 'react';

// Recebe a função 'onImport' como prop para comunicar ao componente pai
function ImportForm({ onImport }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Impede que a página recarregue
    if (!inputValue.trim()) return;

    // Lógica simples para extrair o ID de uma URL completa
    try {
      const url = new URL(inputValue);
      const pathParts = url.pathname.split('/');
      const spotifyId = pathParts[pathParts.length - 1];
      onImport(spotifyId);
    } catch (error) {
      // Se não for uma URL válida, assume que é o ID direto
      onImport(inputValue);
    }

    setInputValue(''); // Limpa o campo após o envio
  };

  return (
    <form onSubmit={handleSubmit} className="import-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Cole a URL ou o ID do álbum do Spotify"
        className="import-input"
      />
      <button type="submit" className="import-button">
        Importar Álbum
      </button>
    </form>
  );
}

export default ImportForm;