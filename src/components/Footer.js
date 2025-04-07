import React from 'react';
import { partnerLogos } from '../assets/images';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column">
          <h3 className="footer__title">CinemaTicket</h3>
          <p className="footer__description">Experience the magic of cinema with blockchain-enabled secure ticketing. Your perfect movie experience is just a click away.</p>
          <div className="footer__social">
            <button aria-label="Facebook" className="footer__social-btn"><i className="fab fa-facebook-f"></i></button>
            <button aria-label="Twitter" className="footer__social-btn"><i className="fab fa-twitter"></i></button>
            <button aria-label="Instagram" className="footer__social-btn"><i className="fab fa-instagram"></i></button>
            <button aria-label="Youtube" className="footer__social-btn"><i className="fab fa-youtube"></i></button>
            <button aria-label="Pinterest" className="footer__social-btn"><i className="fab fa-pinterest-p"></i></button>
          </div>
        </div>
        
        <div className="footer__column">
          <h3 className="footer__title">Useful Links</h3>
          <button className="footer__link-btn">About Us</button>
          <button className="footer__link-btn">FAQs</button>
          <button className="footer__link-btn">Contact Us</button>
          <button className="footer__link-btn">News & Articles</button>
          <button className="footer__link-btn">Terms of Service</button>
        </div>
        
        <div className="footer__column">
          <h3 className="footer__title">Genres</h3>
          <button className="footer__link-btn">Action</button>
          <button className="footer__link-btn">Comedy</button>
          <button className="footer__link-btn">Drama</button>
          <button className="footer__link-btn">Horror</button>
          <button className="footer__link-btn">Sci-Fi</button>
        </div>
        
        <div className="footer__column">
          <h3 className="footer__title">Contact</h3>
          <p className="footer__description">
            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#f07e88' }}></i> 123 Movie Lane, Cinema City
          </p>
          <p className="footer__description">
            <i className="fas fa-phone-alt" style={{ marginRight: '8px', color: '#f07e88' }}></i> +1 234 567 8901
          </p>
          <p className="footer__description">
            <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#f07e88' }}></i> info@cinematicket.io
          </p>
          
          <h3 className="footer__title" style={{ marginTop: '20px' }}>Our Partners</h3>
          <div className="footer__partners">
            {partnerLogos.map((logo, index) => (
              <img 
                key={index} 
                src={logo} 
                alt={`Partner ${index + 1}`} 
                className="footer__partner"
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="footer__copyright">
        <p>© 2023 CinemaTicket. All rights reserved. Built with <span style={{ color: '#f07e88' }}>❤️</span> on the Ethereum blockchain</p>
      </div>
    </footer>
  );
};

export default Footer; 