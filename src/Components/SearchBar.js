import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => { // 1. Recebe 'onSearch' como prop
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (query.trim()) {
      onSearch(query); // 2. Chama a função recebida com o texto da busca
    }
  };

  return (
    // 3. O formulário chama 'handleSearch' no evento onSubmit
    <form onSubmit={handleSearch} className="search-form"> 
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar álbuns no Spotify..."
        className="search-input"
      />
      <button type="submit" className="search-button">Buscar</button>
    </form>
  );
};

export default SearchBar;