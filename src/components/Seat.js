import React, { useState, useEffect } from 'react';

const Seat = ({ i, step, seatsTaken, buyHandler, isLoading, category = "NORMAL", price = "0.00", setSelectedSeat, id }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // Update isMobile state on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const isSeatTaken = seatsTaken.find(seat => Number(seat) === i) ? true : false;
    
    const handleSeatClick = () => {
        if (!isSeatTaken && !isLoading) {
            setSelectedSeat(i);
            setShowPopup(true);
            
            // Hide popup after 5 seconds
            setTimeout(() => {
                if (!step) {
                    setShowPopup(false);
                }
            }, 5000);
        }
    };
    
    const handleCancel = (e) => {
        e.stopPropagation();
        setShowPopup(false);
        setSelectedSeat(null);
    };
    
    const handleBuy = (e) => {
        e.stopPropagation();
        setShowPopup(false);
        if (buyHandler) buyHandler(i);
    };
    
    return (
        <>
            <div 
                className={`seat ${step ? 'seat--selected' : ''} ${isSeatTaken ? 'seat--taken' : ''} seat--${category.toLowerCase()}`}
                id={id}
                onClick={handleSeatClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {!isSeatTaken ? (
                    <>
                        <span className="seat__number">{i}</span>
                        {isHovered && !step && !isMobile && (
                            <div className="seat-tooltip">
                                Seat <strong>#{i}</strong> - {price} Sepolia
                            </div>
                        )}
                    </>
                ) : (
                    <i className="fas fa-times"></i>
                )}
            </div>
            
            {showPopup && !isSeatTaken && (
                <div className={`seat-purchase-popup ${showPopup ? 'seat-purchase-popup--active' : ''}`}>
                    <div className="seat-purchase-popup__info">
                        <h3 className="seat-purchase-popup__title">Selected Seat: #{i}</h3>
                        <div className="seat-purchase-popup__details">
                            <span className="seat-purchase-popup__detail">Category: {category}</span>
                            <span className="seat-purchase-popup__price">Price: {price} Sepolia</span>
                        </div>
                    </div>
                    <div className="seat-purchase-popup__actions">
                        <button 
                            className="seat-purchase-popup__cancel"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            className="seat-purchase-popup__buy bounce-animation"
                            onClick={handleBuy}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Seat;