import React from 'react';
import AlbumCard from './AlbumCard';

// Recebe a lista de álbuns como 'props'
function AlbumList({ albums }) {
  if (!albums || albums.length === 0) {
    return <p>Nenhum álbum encontrado. Importe um novo álbum para começar!</p>;
  }

  return (
    <div className="cards-container">
      {albums.map((album) => (
        // A 'key' é essencial para o React otimizar a renderização de listas
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}

export default AlbumList;