import React from 'react';

// Agora recebe 'onAlbumSelect' como uma prop
function AlbumCard({ album, onAlbumSelect }) {
  return (
    // Adiciona o evento onClick ao card inteiro
    <div className="card" onClick={() => onAlbumSelect(album)}>
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