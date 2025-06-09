import React, { useState, useEffect } from 'react';

const StarRating = ({ rating = 0, numRatings = 0, onRate }) => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(rating);

  useEffect(() => {
    setSelected(rating);
  }, [rating]);

  const roundedRating = Math.round(rating * 2) / 2;

  const renderStar = (star) => {
    if (hovered !== null) {
      return star <= hovered ? '★' : '☆';
    }

    if (star <= Math.floor(roundedRating)) {
      return '★';
    } else if (star === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
      return '⯨'; 
    } else {
      return '☆'; 
    }
  };

  const handleClick = (index) => {
    setSelected(index);
    if (onRate) onRate(index);
  };

  const handleMouseEnter = (index) => setHovered(index);
  const handleMouseLeave = () => setHovered(null);

  return (
    <div style={{ color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{ userSelect: 'none' }}
          aria-label={`${star} star`}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleClick(star) }}
        >
          {renderStar(star)}
        </span>
      ))} 

    </div>
  );
};

export default StarRating;
