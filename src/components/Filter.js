import { useState, useEffect } from 'react';

const Filter = ({ occasions, onFilterChange }) => {
  const [filters, setFilters] = useState({
    date: '',
    location: '',
    genre: ''
  });
  
  const [options, setOptions] = useState({
    dates: [],
    locations: [],
    genres: []
  });
  
  // Extract unique options from occasions
  useEffect(() => {
    if (!occasions || occasions.length === 0) return;
    
    const dates = [...new Set(occasions.map(occasion => occasion.date))].sort();
    const locations = [...new Set(occasions.map(occasion => occasion.location))];
    
    // Extract genres from all occasions and flatten them
    const allGenres = occasions
      .filter(occasion => occasion.genres)
      .flatMap(occasion => occasion.genres);
    const genres = [...new Set(allGenres)];
    
    setOptions({ dates, locations, genres });
  }, [occasions]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = { date: '', location: '', genre: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  return (
    <div className="filter">
      <div className="filter__container">
        <div className="filter__group">
          <label className="filter__label">Date</label>
          <select 
            name="date" 
            value={filters.date} 
            onChange={handleFilterChange}
            className="filter__select"
          >
            <option value="">All Dates</option>
            {options.dates.map((date, index) => (
              <option key={index} value={date}>{date}</option>
            ))}
          </select>
        </div>
        
        <div className="filter__group">
          <label className="filter__label">Location</label>
          <select 
            name="location" 
            value={filters.location} 
            onChange={handleFilterChange}
            className="filter__select"
          >
            <option value="">All Locations</option>
            {options.locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="filter__group">
          <label className="filter__label">Genre</label>
          <select 
            name="genre" 
            value={filters.genre} 
            onChange={handleFilterChange}
            className="filter__select"
          >
            <option value="">All Genres</option>
            {options.genres.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <button 
          className="filter__clear-btn" 
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filter; 