import { useState, useEffect } from 'react';
import { bannerImages } from '../assets/images';

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">
      <div 
        className="banner__container" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <div 
            key={index} 
            className="banner__slide"
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      
      <div className="banner__dots">
        {bannerImages.map((_, index) => (
          <div 
            key={index}
            className={`banner__dot ${index === currentIndex ? 'banner__dot--active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner; 