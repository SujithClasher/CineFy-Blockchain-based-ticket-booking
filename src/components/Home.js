import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Filter from './Filter';
import { hasTimePassed } from '../utils';
import loading from '../assets/loading.gif';
import { movieImages } from '../assets/images';

const Home = ({ occasions, toggle, provider, account, network }) => {
  const [filteredOccasions, setFilteredOccasions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (occasions) {
      setFilteredOccasions(occasions);
      setIsLoading(false);
    }
  }, [occasions]);
  
  const handleFilterChange = (filters) => {
    if (!occasions) return;
    
    let filtered = [...occasions];
    
    // Apply date filter
    if (filters.date) {
      filtered = filtered.filter(occasion => occasion.date === filters.date);
    }
    
    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(occasion => occasion.location === filters.location);
    }
    
    // Apply genre filter
    if (filters.genre) {
      filtered = filtered.filter(occasion => 
        occasion.genres && occasion.genres.includes(filters.genre)
      );
    }
    
    setFilteredOccasions(filtered);
  };
  
  // Check if a show is sold out or has passed
  const isShowAvailable = (occasion) => {
    if (!occasion) return false;
    // Sold out if tickets === 0
    if (parseInt(occasion.tickets) === 0) return false;
    // Passed if date and time are in the past
    if (occasion.date && occasion.time && hasTimePassed(occasion.date, occasion.time)) return false;
    return true;
  };
  
  // Get movie details from movieImages
  const getMovieDetails = (movieName) => {
    return movieImages[movieName] || {
      poster: "https://media.istockphoto.com/id/1191001701/photo/popcorn-and-clapperboard.jpg?s=612x612&w=0&k=20&c=iUkFTVuU8k-UCcZDxczTWs6gkRa0nAMihp2Jf_2ASKM=",
      rating: "N/A",
      genre: "Movie"
    };
  };
  
  return (
    <div className="home">
      <h2 className="section__heading">Latest Movie Shows</h2>
      
      {isLoading ? (
        <div className="loading">
          <img src={loading} alt="Loading" />
        </div>
      ) : (
        <>
          <Filter occasions={occasions} onFilterChange={handleFilterChange} />
          
          {filteredOccasions.length > 0 ? (
            <div className="movies__grid">
              {filteredOccasions.map((occasion, index) => {
                const movieDetail = getMovieDetails(occasion.name);
                return (
                  <div className="card" key={index}>
                    <div className="card__poster">
                      <img src={occasion.posterUrl || movieDetail.poster} alt={occasion.name} />
                      {(occasion.rating || movieDetail.rating) && (
                        <span className="card__badge card__badge--rating">
                          <i className="fa-solid fa-star"></i> {occasion.rating || movieDetail.rating}
                        </span>
                      )}
                      {occasion.date && (
                        <span className="card__badge card__badge--date">
                          {occasion.date}
                        </span>
                      )}
                      <div className="card__overlay"></div>
                    </div>
                    
                    <div className="card__info">
                      <div className="card__header">
                        <h3 className="card__title">{occasion.name}</h3>
                        <div className="card__price">
                          {parseInt(occasion.cost) / 10**18} ETH
                        </div>
                      </div>
                      
                      <div className="card__meta">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{occasion.location}</span>
                        <span className="card__meta-divider">•</span>
                        <span>{occasion.time}</span>
                        {(occasion.genres && occasion.genres.length > 0) ||
                         (movieDetail.genre && movieDetail.genre.split(',').length > 0) ? (
                          <>
                            <span className="card__meta-divider">•</span>
                            <span>
                              {occasion.genres && occasion.genres.length > 0 
                                ? occasion.genres[0]
                                : movieDetail.genre.split(',')[0].trim()}
                            </span>
                          </>
                        ) : null}
                      </div>
                      
                      <p className="card__description">
                        {occasion.description || movieDetail.description || "Experience this amazing movie on the big screen."}
                      </p>
                      
                      {isShowAvailable(occasion) ? (
                        <Link to={`/seating/${occasion.id}`} className="card__button">
                          <i className="fa-solid fa-ticket"></i> Book Tickets
                        </Link>
                      ) : (
                        <button className="card__button--out" disabled>
                          {parseInt(occasion.tickets) === 0 ? "Sold Out" : "Show Passed"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <h3>No movies match your filters</h3>
              <p>Try adjusting your filter criteria or check back later for more shows.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home; 