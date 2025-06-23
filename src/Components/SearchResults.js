import React from 'react';

const SearchResults = ({ results, onImport }) => {
  if (!results || results.length === 0) {
    return null; // Não renderiza nada se não houver resultados
  }

  return (
    <div className="search-results">
      <h4>Resultados da Busca</h4>
      <ul>
        {results.map((album) => (
          <li key={album.id}>
            <img src={album.images?.[0]?.url} alt={album.name} />
            <div className="result-info">
              <strong>{album.name}</strong>
              <span>{album.artists.map(a => a.name).join(', ')} ({album.release_date.substring(0, 4)})</span>
            </div>
            <button onClick={() => onImport(album.id)} className="import-result-button">
              + Importar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;