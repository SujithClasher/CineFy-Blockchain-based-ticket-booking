import React, { useEffect, useState } from 'react';

const TicketConfirmation = ({ 
  visible, 
  onClose, 
  movieName, 
  seatNumber, 
  category, 
  date, 
  time, 
  location, 
  ticketId
}) => {
  const [ticketCode, setTicketCode] = useState('');
  
  // Generate a random ticket code
  useEffect(() => {
    if (visible) {
      const generateTicketCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      
      setTicketCode(generateTicketCode());
      
      // Add auto-refresh after 4 seconds
      const refreshTimer = setTimeout(() => {
        console.log("Auto-refreshing page after ticket confirmation...");
        window.location.reload();
      }, 4000);
      
      // Clean up the timer when component unmounts or visibility changes
      return () => clearTimeout(refreshTimer);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div className="ticket-confirmation">
      <div className="ticket-confirmation__content">
        <button 
          className="ticket-confirmation__close" 
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
        
        <div className="ticket-confirmation__header">
          <i className="fas fa-check-circle"></i>
          <h2>Ticket Confirmed!</h2>
          <p>Your blockchain ticket has been successfully booked</p>
        </div>
        
        <div className="ticket-confirmation__ticket">
          <h3>{movieName}</h3>
          
          <div className="ticket-confirmation__details">
            <div className="ticket-confirmation__detail">
              <i className="fas fa-calendar-alt"></i>
              <span>{date}</span>
            </div>
            <div className="ticket-confirmation__detail">
              <i className="fas fa-clock"></i>
              <span>{time}</span>
            </div>
            <div className="ticket-confirmation__detail">
              <i className="fas fa-map-marker-alt"></i>
              <span>{location}</span>
            </div>
          </div>
          
          <div className="ticket-confirmation__divider">
            <div className="ticket-confirmation__hole ticket-confirmation__hole--top"></div>
            <div className="ticket-confirmation__line"></div>
            <div className="ticket-confirmation__hole ticket-confirmation__hole--bottom"></div>
          </div>
          
          <div className="ticket-confirmation__seat-info">
            <div className="ticket-confirmation__seat">
              <span className="ticket-confirmation__label">Seat</span>
              <span className="ticket-confirmation__value">#{seatNumber}</span>
              <span className="ticket-confirmation__category">{category}</span>
            </div>
            
            <div className="ticket-confirmation__ticket-code">
              <div className="ticket-confirmation__label">Ticket ID</div>
              <div className="ticket-confirmation__code">{ticketCode}</div>
            </div>
          </div>
        </div>
        
        <div className="ticket-confirmation__footer">
          <p>Please show this ticket ID at the entrance</p>
          <div className="ticket-confirmation__ticket-id">
            <span className="ticket-confirmation__id-label">Ticket ID:</span>
            <span className="ticket-confirmation__id-value">{ticketCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmation; 