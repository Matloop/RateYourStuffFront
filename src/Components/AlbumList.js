import React from 'react';
import AlbumCard from './AlbumCard';

function AlbumList({ albums, onAlbumSelect }) {
  if (!albums || albums.length === 0) {
    return <p>Nenhum álbum encontrado. Importe um novo álbum para começar!</p>;
  }

  return (
    <div className="cards-container">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onAlbumSelect={onAlbumSelect} />
      ))}
    </div>
  );
}

export default AlbumList;