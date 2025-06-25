import React from 'react';

function AlbumCard({ album, onAlbumSelect }) {
  return (
    <div className="card" onClick={() => onAlbumSelect(album)}>
      {/* Adicionado um fallback caso não haja imagem */}
      <img src={album.imageUrl || 'https://via.placeholder.com/220'} alt={`Capa do álbum ${album.name}`} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{album.name}</h2>
        <p className="card-artist">{album.artistName}</p>
        <p className="card-date">Lançado em: {album.releaseDate}</p>
      </div>
    </div>
  );
}

export default AlbumCard;