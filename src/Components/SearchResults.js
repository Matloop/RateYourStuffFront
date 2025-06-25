import React from 'react';

const SearchResults = ({ results, onImport }) => {
  // 1. Condição de guarda: se não houver resultados, não renderiza nada.
  if (!results || results.length === 0) {
    return null; 
  }

  return (
    <div className="search-results">
      <h4>Resultados da Busca</h4>
      <ul>
        {/* 2. Mapeia os resultados para criar os itens da lista */}
        {results.map((album) => (
          <li key={album.id}>
            {/* 3. A imagem usa 'images[0].url', o que é comum em respostas do Spotify */}
            <img src={album.images?.[0]?.url} alt={album.name} />
            <div className="result-info">
              <strong>{album.name}</strong>
              {/* 4. Mapeia os artistas e pega o ano do 'release_date' */}
              <span>{album.artists.map(a => a.name).join(', ')} ({album.release_date.substring(0, 4)})</span>
            </div>
            {/* 5. O botão chama 'onImport' com o ID do álbum do Spotify */}
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