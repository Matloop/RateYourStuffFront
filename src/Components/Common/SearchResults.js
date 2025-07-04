import React from 'react';

const SearchResults = ({ results, onImport }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      <h4>Resultados da Busca</h4>
      <ul>
        {results.map((item) => (
          <li key={item.apiId}>
            <img src={item.imageUrl} alt={item.title} />
            <div className="result-info">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
            <button onClick={() => onImport(item.apiId)} className="import-result-button">
              + Importar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;