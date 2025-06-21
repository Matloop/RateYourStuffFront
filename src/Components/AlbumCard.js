import React from 'react';

// Recebe os dados de um único álbum como 'props'
function AlbumCard({ album }) {
  return (
    <div className="card">
      <img src={album.imageUrl} alt={`Capa do álbum ${album.name}`} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{album.name}</h2>
        <p className="card-artist">{album.artistName}</p>
        <p className="card-date">Lançado em: {album.releaseDate}</p>
      </div>
    </div>
  );
}

export default AlbumCard;