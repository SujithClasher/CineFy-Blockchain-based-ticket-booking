import React, { useState } from 'react';
import { ethers } from 'ethers';
import { movieImages } from '../assets/images';

const Card = ({ occasion, setToggle, setOccasion }) => {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get movie details from our image database or use defaults
  const movieData = movieImages[occasion.name] || {
    poster: "https://media.istockphoto.com/id/1191001701/photo/popcorn-and-clapperboard.jpg?s=612x612&w=0&k=20&c=iUkFTVuU8k-UCcZDxczTWs6gkRa0nAMihp2Jf_2ASKM=",
    rating: "N/A",
    genre: "Movie",
    description: "No description available"
  };

  const isSoldOut = Number(occasion.tickets) >= Number(occasion.maxTickets);

  const handleClick = () => {
    if (isSoldOut) return;
    
    setLoading(true);
    
    setOccasion(occasion);
    setToggle(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // For debugging
  console.log(`Rendering card for ${occasion.name}, poster: ${movieData.poster}`);

  return (
    <div 
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="card__poster">
        <img 
          src={movieData.poster} 
          alt={occasion.name} 
          className={isHovered ? "hover-effect" : ""}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://media.istockphoto.com/id/1191001701/photo/popcorn-and-clapperboard.jpg?s=612x612&w=0&k=20&c=iUkFTVuU8k-UCcZDxczTWs6gkRa0nAMihp2Jf_2ASKM=";
          }}
        />
        
        {/* Rating Badge */}
        <div className={`card__badge card__badge--rating ${movieData.rating.includes('Coming') ? 'card__badge--coming-soon' : ''}`}>
          {movieData.rating}
        </div>
        
        {/* Date and Time Badge */}
        <div className="card__badge card__badge--date">
          {occasion.date}
        </div>
        
        <div className="card__overlay"></div>
      </div>
      
      {/* Movie Info */}
      <div className="card__info">
        <div className="card__header">
          <h3 className="card__title">
            {occasion.name}
          </h3>
          <div className="card__price">
            {ethers.utils.formatEther(occasion.cost)} ETH
          </div>
        </div>
        
        <div className="card__meta">
          <i className="fas fa-map-marker-alt"></i>
          <span>{occasion.location}</span>
          <span className="card__meta-divider">•</span>
          <span>{occasion.time}</span>
        </div>
        
        <p className="card__description">
          {movieData.description || "Experience this amazing movie on the big screen."}
        </p>
        
        {isSoldOut ? (
          <button
            type="button"
            className="card__button--out"
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className={`card__button ${isHovered ? 'hover-effect' : ''}`}
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" style={{ borderTopColor: '#000', width: '16px', height: '16px' }} />
            ) : (
              <>
                <i className="fas fa-ticket-alt"></i>
                Buy Tickets
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;