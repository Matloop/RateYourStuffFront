import React from 'react';
import AlbumCard from './AlbumCard';

// Agora recebe 'onAlbumSelect' como uma prop
function AlbumList({ albums, onAlbumSelect }) {
  if (!albums || albums.length === 0) {
    return <p>Nenhum álbum encontrado. Importe um novo álbum para começar!</p>;
  }

  return (
    <div className="cards-container">
      {albums.map((album) => (
        // Passa a função 'onAlbumSelect' para cada card
        <AlbumCard key={album.id} album={album} onAlbumSelect={onAlbumSelect} />
      ))}
    </div>
  );
}

export default AlbumList;