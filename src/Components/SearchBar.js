// File: src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim()); // Passa o valor sem espaços extras
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // --- MUDANÇA AQUI ---
        placeholder="Buscar álbuns ou colar link do Spotify..."
        className="search-input"
      />
      <button type="submit" className="search-button">Buscar / Importar</button>
    </form>
  );
};

export default SearchBar;