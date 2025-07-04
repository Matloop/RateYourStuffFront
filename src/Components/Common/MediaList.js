import React from 'react';

// Componente genérico para renderizar uma lista de cards
const MediaList = ({ items, onItemSelect, emptyMessage }) => {
  if (!items || items.length === 0) {
    return <p className="rated-message">{emptyMessage || "Nenhum item encontrado."}</p>;
  }

  return (
    <div className="cards-container">
      {items.map((item) => (
        <div key={item.id} className="card" onClick={() => onItemSelect(item)}>
          <img src={item.imageUrl} alt={item.title} className="card-image" />
          <div className="card-content">
            <p className="card-title">{item.title}</p>
            <p className="card-subtitle">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaList;