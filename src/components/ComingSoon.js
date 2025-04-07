import React, { useState } from 'react';

const ComingSoon = () => {
  // Sample upcoming movies - these would typically be fetched from an API or a data file
  const upcomingMovies = [
    {
      title: "Deadpool & Wolverine",
      genre: "Action, Comedy, Adventure",
      description: "Deadpool and Wolverine team up for an epic adventure that spans the Marvel multiverse.",
      image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/deadpool-and-wolverine-et00347165-1700631371.jpg",
      releaseDate: "July 26, 2024"
    },
    {
      title: "Venom 3",
      genre: "Action, Sci-Fi, Horror",
      description: "The third installment in the Venom saga brings new challenges as Eddie and Venom face their most dangerous threat yet.",
      image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/venom-the-last-dance-et00365972-1695897726.jpg",
      releaseDate: "Oct 25, 2024"
    },
    {
      title: "Alien: Romulus",
      genre: "Horror, Sci-Fi, Thriller",
      description: "A group of young space colonizers find themselves face to face with the most terrifying life form in the universe.",
      image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/alien-romulus-et00358316-1708330384.jpg",
      releaseDate: "Aug 15, 2024"
    },
    {
      title: "Godzilla x Kong",
      genre: "Action, Adventure, Sci-Fi",
      description: "Godzilla and Kong must team up against a colossal undiscovered threat hidden within our world.",
      image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/godzilla-x-kong-the-new-empire-et00385626-1710923757.jpg",
      releaseDate: "Mar 29, 2024"
    }
  ];

  return (
    <div className="coming-soon">
      <div className="coming-soon__header">
        <h2 className="coming-soon__title">
          <span className="coming-soon__title-highlight"></span>
          Coming Soon
        </h2>
        <button className="coming-soon__view-all">
          View All <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="coming-soon__grid">
        {upcomingMovies.map((movie, index) => (
          <div key={index} className="coming-soon__card">
            <div className="coming-soon__poster">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="coming-soon__image"
              />
            </div>
            <div className="coming-soon__info">
              <div className="coming-soon__header-info">
                <h3 className="coming-soon__movie-title">{movie.title}</h3>
                <span className="coming-soon__badge">Coming Soon</span>
              </div>
              <p className="coming-soon__meta">
                <i className="fas fa-film"></i>
                {movie.genre}
              </p>
              <p className="coming-soon__meta">
                <i className="fas fa-calendar-alt"></i>
                {movie.releaseDate}
              </p>
              <p className="coming-soon__description">{movie.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon; 