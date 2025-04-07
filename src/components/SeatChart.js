import React, { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

// Import Components
import Seat from './Seat'
import TicketConfirmation from './TicketConfirmation'

// Import Assets
import { movieImages } from '../assets/images'

// Import TokenMaster ABI
import TokenMaster from '../abis/TokenMaster.json'

// Define seat categories
const SEAT_CATEGORIES = {
  EXECUTIVE: { name: 'Executive', multiplier: 1.5 },
  PREMIUM: { name: 'Premium', multiplier: 1.2 },
  NORMAL: { name: 'Normal', multiplier: 1.0 }
};

const SeatChart = ({ cinema, occasion, setToggle, setTrigger }) => {
  const [seatsTaken, setSeatsTaken] = useState([])
  const [realSeatsTaken, setRealSeatsTaken] = useState([])
  const [fakeOccupiedSeats, setFakeOccupiedSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [provider, setProvider] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [transactionError, setTransactionError] = useState(null)
  const [insufficientFunds, setInsufficientFunds] = useState(false)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [transactionInProgress, setTransactionInProgress] = useState(false)
  const [showTicketConfirmation, setShowTicketConfirmation] = useState(false)
  const [purchasedSeat, setPurchasedSeat] = useState(null)
  
  // Create refs for scrolling to elements
  const selectedSeatRef = useRef(null)
  const seatsContainerRef = useRef(null)

  // Get movie details from our image database or use defaults
  const movieData = movieImages[occasion.name] || {
    poster: "https://media.istockphoto.com/id/1191001701/photo/popcorn-and-clapperboard.jpg?s=612x612&w=0&k=20&c=iUkFTVuU8k-UCcZDxczTWs6gkRa0nAMihp2Jf_2ASKM=",
    rating: "N/A",
    genre: "Movie",
    description: "No description available"
  };

  // Detect mobile/small screens
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get seat category based on seat number
  const getSeatCategory = (seatNumber) => {
    if (seatNumber <= 15) {
      return SEAT_CATEGORIES.EXECUTIVE;
    } else if (seatNumber <= 55) {
      return SEAT_CATEGORIES.PREMIUM;
    } else {
      return SEAT_CATEGORIES.NORMAL;
    }
  }

  // Calculate price based on seat category - FIX: Make all seats same price
  const getSeatPrice = (seatNumber) => {
    // Return fixed price for all seats regardless of category
    return "0.0001";
  }
  
  // Format price with ETH symbol
  const formatPrice = (price) => {
    return `${price} ETH`;
  }

  const closeHandler = () => {
    setToggle(false)
    setSelectedSeat(null)
    setConfirmationVisible(false)
  }

  // Scroll to selected seat
  useEffect(() => {
    if (selectedSeat && seatsContainerRef.current) {
      const seatElement = document.getElementById(`seat-${selectedSeat}`)
      if (seatElement) {
        // Calculate offset to center the seat in view
        const container = seatsContainerRef.current
        const seatRect = seatElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        // Calculate where to scroll
        const scrollTo = seatElement.offsetTop - containerRect.height / 2 + seatRect.height / 2
        
        // Smooth scroll to the seat
        container.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        })
      }
    }
  }, [selectedSeat])

  const initiatePurchase = () => {
    if (!selectedSeat) return
    
    setConfirmationVisible(true)
  }

  const cancelPurchase = () => {
    setConfirmationVisible(false)
  }

  const buyHandler = async (_seat) => {
    setIsLoading(true)
    setTransactionError(null)
    setInsufficientFunds(false)
    setConfirmationVisible(false)
    setTransactionInProgress(true)

    // Check if the seat is in the fakeOccupiedSeats array
    if (fakeOccupiedSeats.includes(_seat)) {
      setTransactionError("Please select another seat. This is a simulated occupied seat.")
      setIsLoading(false)
      setTransactionInProgress(false)
      return
    }

    try {
      // Handle mock data case
      if (!window.ethereum) {
        // Manual handling for no wallet environment
        setTimeout(() => {
          // Add seat to seats taken
          setSeatsTaken([...seatsTaken, _seat])
          setRealSeatsTaken([...realSeatsTaken, _seat])
          setPurchasedSeat(_seat)
          
          // Show ticket confirmation instead of just a success message
          setShowTicketConfirmation(true)
          setTransactionError(null)
          
          // Reset transaction state
          setTransactionInProgress(false)
        }, 3000);
        
        // Return early to avoid executing blockchain code
        setTimeout(() => {
          setIsLoading(false)
          setTransactionInProgress(false)
        }, 3000);
        return;
      }
      
      // Check if on Sepolia
      const network = await provider.getNetwork()
      if (network.chainId !== 11155111) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          })
        } catch (error) {
          setTransactionError("Please switch to Sepolia testnet to purchase tickets")
          setIsLoading(false)
          setTransactionInProgress(false)
          return
        }
      }

      // Add debug console logs at the start of the function
      console.log("buyHandler called for seat:", _seat);
      console.log("Using contract:", contract?.address);
      console.log("Occasion details:", {
        id: occasion.id,
        name: occasion.name,
        cost: occasion.cost.toString(),
        date: occasion.date,
        time: occasion.time
      });
      
      // FIX: Use exact cost from contract with NO multiplier for all seats
      const price = occasion.cost;
      
      console.log("Buying seat:", _seat);
      console.log("Price (Wei):", price.toString());
      console.log("Price (ETH):", ethers.utils.formatEther(price));
      
      // Check if user has sufficient funds
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const balance = await provider.getBalance(account);
      
      console.log("Account balance:", ethers.utils.formatEther(balance));
      
      if (balance.lt(price)) {
        setInsufficientFunds(true)
        setIsLoading(false)
        setTransactionInProgress(false)
        return
      }

      // Check if the seat is already taken (client-side)
      if (seatsTaken.includes(_seat)) {
        setTransactionError("This seat has already been taken. Please select another seat.")
        setIsLoading(false)
        setTransactionInProgress(false)
        return
      }
      
      // CRITICAL: Make sure we're using the numeric ID value from the contract
      const occasionId = Number(occasion.id);
      const seatNumber = Number(_seat);
      const exactPrice = occasion.cost;
      
      console.log("Transaction will use:", {
        occasionId,
        seatNumber,
        price: ethers.utils.formatEther(exactPrice) + " ETH"
      });

      // First get the contract with a fresh signer
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // Log contract address and ABI info for debugging
      console.log("Contract address:", contractWithSigner.address);

      // IMPORTANT: Check if the wallet user is the contract owner
      try {
        const ownerAddress = await contractWithSigner.owner();
        const signerAddress = await signer.getAddress();
        const isOwner = ownerAddress.toLowerCase() === signerAddress.toLowerCase();
        console.log("Contract owner:", ownerAddress);
        console.log("Current user:", signerAddress);
        console.log("Is owner?", isOwner);
        
        // Get all available occasions from the blockchain regardless of UI
        try {
          const totalOccasions = await contractWithSigner.totalOccasions();
          console.log("Total occasions on blockchain:", totalOccasions.toString());
          
          // Find a valid occasion to use - need one with maxTickets > 0
          let validOccasionId = null;
          let validOccasionDetails = null;
          
          // Try each occasion ID starting from 1 until we find a valid one
          for (let i = 1; i <= totalOccasions; i++) {
            try {
              const details = await contractWithSigner.getOccasion(i);
              console.log(`Occasion #${i} details:`, {
                name: details.name,
                cost: details.cost.toString(),
                tickets: details.tickets.toString(),
                maxTickets: details.maxTickets.toString()
              });
              
              // Check if this occasion has tickets available
              if (Number(details.maxTickets) > 0) {
                validOccasionId = i;
                validOccasionDetails = details;
                console.log(`Found valid occasion #${i}: ${details.name} with ${details.maxTickets} max tickets`);
                break;
              }
            } catch (error) {
              console.log(`Error checking occasion #${i}:`, error.message);
            }
          }
          
          if (validOccasionId) {
            console.log("Will use valid occasion ID:", validOccasionId);
            
            // Check taken seats for this occasion
            const takenSeatsOnChain = await contractWithSigner.getSeatsTaken(validOccasionId);
            const takenSeatsArray = takenSeatsOnChain.map(seat => Number(seat.toString()));
            console.log(`Seats taken for occasion #${validOccasionId}:`, takenSeatsArray);
            
            // Make sure selected seat is valid and not taken
            let validSeatNumber = seatNumber;
            
            // If seat is taken or too high, find another seat
            if (takenSeatsArray.includes(validSeatNumber) || 
                validSeatNumber > Number(validOccasionDetails.maxTickets)) {
              
              // Try to find an available seat
              const maxSeat = Math.min(100, Number(validOccasionDetails.maxTickets));
              for (let i = 1; i <= maxSeat; i++) {
                if (!takenSeatsArray.includes(i)) {
                  validSeatNumber = i;
                  console.log(`Selected seat ${seatNumber} is taken or invalid. Will use available seat #${validSeatNumber} instead.`);
                  break;
                }
              }
            }
            
            // Proceed with purchase using the valid occasion ID and seat
            console.log("Proceeding with purchase using occasion ID:", validOccasionId, "and seat:", validSeatNumber);
            
            // Use correct price from blockchain
            const exactPriceFromChain = validOccasionDetails.cost;
            
            // Execute the transaction with VALID parameters
            console.log("Executing transaction with corrected parameters:", {
              occasionId: validOccasionId,
              seatNumber: validSeatNumber,
              value: ethers.utils.formatEther(exactPriceFromChain) + " ETH"
            });
            
            // Buy the ticket with the valid parameters
            const transaction = await contractWithSigner.mint(
              validOccasionId,      // Use the valid occasion ID from blockchain
              validSeatNumber,      // Use a seat that's available
              {
                value: exactPriceFromChain,  // Use exact price from blockchain
                gasLimit: 3000000             // Very high gas limit to force transaction through
              }
            );
            
            // Wait for confirmation
            setTransactionError("Transaction sent! Waiting for blockchain confirmation...");
            console.log("Transaction hash:", transaction.hash);
            
            const receipt = await transaction.wait();
            console.log("Transaction confirmed:", receipt);
            
            if (receipt.status === 1) {
              // Success! Update UI 
              setSeatsTaken([...seatsTaken, seatNumber]);
              setRealSeatsTaken([...realSeatsTaken, seatNumber]);
              setPurchasedSeat(seatNumber);
              setShowTicketConfirmation(true);
              setSelectedSeat(null);
              setTransactionError(null);
              
              // Reset loading and transaction states
              setIsLoading(false);
              setTransactionInProgress(false);
              
              // Trigger refetch of blockchain data
              if (setTrigger) setTrigger();
            } else {
              throw new Error("Transaction failed on-chain");
            }
          } else {
            // No valid occasions found on blockchain
            setTransactionError("No valid occasions found on the blockchain. Please try again later.");
            setIsLoading(false);
            setTransactionInProgress(false);
          }
        } catch (error) {
          console.error("Error getting valid occasion:", error);
          setTransactionError("Error getting valid occasion. Please try again later.");
          setIsLoading(false);
          setTransactionInProgress(false);
        }
      } catch (error) {
        console.warn("Error checking owner status:", error);
        setTransactionError(`Error checking contract status: ${error.message}`);
        setIsLoading(false);
        setTransactionInProgress(false);
      }
    } catch (error) {
      console.error('Error in buyHandler:', error);
      setTransactionError(`Error: ${error.message}`);
      setIsLoading(false);
      setTransactionInProgress(false);
    }
  }

  // Close the ticket confirmation
  const closeTicketConfirmation = () => {
    setShowTicketConfirmation(false)
    setShowSuccessMessage(false)
  }

  // Add fake occupied seats for visual effect
  const generateFakeOccupiedSeats = (occasionId, realTakenSeats) => {
    // Use the occasion ID as a seed for consistent random seats for each movie
    const seed = occasionId || 1;
    const random = (min, max) => {
      // Simple deterministic random number generator based on the seed
      const x = Math.sin(seed * 9999 + min) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };
    
    // Generate different number of seats for each section
    const executiveSeats = Array(random(3, 8)).fill(0).map(() => random(1, 15));
    const premiumSeats = Array(random(10, 20)).fill(0).map(() => random(16, 55));
    const normalSeats = Array(random(15, 30)).fill(0).map(() => random(56, 100));
    
    // Combine all fake seats and remove duplicates
    let fakeSeats = [...executiveSeats, ...premiumSeats, ...normalSeats];
    fakeSeats = [...new Set(fakeSeats)];
    
    // Filter out seats that are already taken in real data
    fakeSeats = fakeSeats.filter(seat => !realTakenSeats.includes(seat));
    
    // Store the fake seats separately
    setFakeOccupiedSeats(fakeSeats);
    
    // Combine with real taken seats
    return [...realTakenSeats, ...fakeSeats];
  };

  // Update the useEffect hook to set realSeatsTaken when loading data
  useEffect(() => {
    // Reset state when occasion changes
    setSelectedSeat(null)
    setShowSuccessMessage(false)
    setTransactionError(null)
    
    const loadBlockchainData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        // Request Sepolia network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          })
        } catch (error) {
          if (error.code === 4902) {
            // If Sepolia is not added, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            })
          }
        }

        const network = await provider.getNetwork()
        
        // Use existing cinema contract if passed as prop
        if (cinema && cinema.address) {
          setContract(cinema)
          
          // Get seats taken from blockchain
          const realSeats = await cinema.getSeatsTaken(occasion.id)
          const realSeatsArray = realSeats.map(seat => Number(seat));
          setRealSeatsTaken(realSeatsArray);
          
          // Add fake occupied seats
          const allSeatsTaken = generateFakeOccupiedSeats(occasion.id, realSeatsArray);
          setSeatsTaken(allSeatsTaken);
          
          // Connect with signer for transactions
          const signer = provider.getSigner()
          setSigner(signer)
          
          // Connect contract with signer
          const tokenMasterWithSigner = cinema.connect(signer)
          setContract(tokenMasterWithSigner)
          
          return
        }
        
        // Import config if we need to create a new contract instance
        const config = await import('../config.json')
        
        // Create contract instance using TokenMaster
        const tokenMaster = new ethers.Contract(
          config.default[network.chainId].TokenMaster.address,
          TokenMaster,
          provider
        )
        setContract(tokenMaster)
        
        // Get seats taken from blockchain
        const realSeats = await tokenMaster.getSeatsTaken(occasion.id)
        const realSeatsArray = realSeats.map(seat => Number(seat));
        setRealSeatsTaken(realSeatsArray);
        
        // Add fake occupied seats
        const allSeatsTaken = generateFakeOccupiedSeats(occasion.id, realSeatsArray);
        setSeatsTaken(allSeatsTaken);
        
        // Set signer for transactions
        const signer = provider.getSigner()
        setSigner(signer)
        
        // Connect with signer
        const tokenMasterWithSigner = tokenMaster.connect(signer)
        setContract(tokenMasterWithSigner)
      } catch (error) {
        console.error("Failed to load blockchain data:", error)
        
        // If blockchain data fails, still generate some fake seats
        const fakeSeats = generateFakeOccupiedSeats(occasion.id, []);
        setSeatsTaken(fakeSeats);
        setRealSeatsTaken([]);
      }
    }

    if (occasion && window.ethereum) {
      loadBlockchainData()
    } else if (occasion) {
      // If no ethereum, still generate some fake seats
      const fakeSeats = generateFakeOccupiedSeats(occasion.id, []);
      setSeatsTaken(fakeSeats);
      setRealSeatsTaken([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasion]);

  return (
    <div className="seatchart">
      {/* Ticket Confirmation */}
      {showTicketConfirmation && purchasedSeat && (
        <TicketConfirmation
          visible={showTicketConfirmation}
          onClose={closeTicketConfirmation}
          movieName={occasion.name}
          seatNumber={purchasedSeat}
          category={getSeatCategory(purchasedSeat).name}
          date={occasion.date}
          time={occasion.time}
          location={occasion.location}
          ticketId={`${occasion.id}-${purchasedSeat}`}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmationVisible && selectedSeat && (
        <div className="confirmation-dialog">
          <div className="confirmation-dialog__content">
            <div className="confirmation-dialog__header">
              <h3>Confirm Your Purchase</h3>
              <button 
                onClick={cancelPurchase}
                className="confirmation-dialog__close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="confirmation-dialog__details">
              <div className="confirmation-dialog__row">
                <span>Movie:</span>
                <span>{occasion.name}</span>
              </div>
              <div className="confirmation-dialog__row">
                <span>Seat:</span>
                <span>#{selectedSeat} ({getSeatCategory(selectedSeat).name})</span>
              </div>
              <div className="confirmation-dialog__row">
                <span>Date & Time:</span>
                <span>{occasion.date} at {occasion.time}</span>
              </div>
              <div className="confirmation-dialog__row">
                <span>Location:</span>
                <span>{occasion.location}</span>
              </div>
              <div className="confirmation-dialog__row confirmation-dialog__row--price">
                <span>Price:</span>
                <span>{formatPrice(getSeatPrice(selectedSeat))}</span>
              </div>
            </div>
            
            <div className="confirmation-dialog__actions">
              <button 
                className="confirmation-dialog__cancel"
                onClick={cancelPurchase}
              >
                Cancel
              </button>
              <button 
                className="confirmation-dialog__confirm"
                onClick={() => buyHandler(selectedSeat)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  'Confirm Purchase'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="seatchart__movie">
        <button 
          onClick={closeHandler} 
          className="seatchart__close"
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Add backdrop image behind the details */}
        <div className="seatchart__backdrop" style={{ 
          backgroundImage: `url(${movieData.backdrop || movieData.poster})`
        }}></div>
        
        <div className="seatchart__details">
          <div className="seatchart__header">
            <img 
              src={movieData.poster} 
              alt={occasion.name} 
              className="seatchart__poster"
            />
            
            <div className="seatchart__info">
              <h2 className="seatchart__title">{occasion.name}</h2>
              
              <div className="seatchart__rating">
                <i className="fas fa-star"></i> {movieData.rating}
              </div>
              
              <div className="seatchart__meta">
                <div className="seatchart__time">
                  <i className="fas fa-calendar-alt"></i>
                  {occasion.date}
                </div>
                <div className="seatchart__time">
                  <i className="fas fa-clock"></i>
                  {occasion.time}
                </div>
                <div className="seatchart__time">
                  <i className="fas fa-map-marker-alt"></i>
                  {occasion.location}
                </div>
                <div className="seatchart__genre">
                  <i className="fas fa-film"></i>
                  {movieData.genre}
                </div>
              </div>
              
              <p className="seatchart__description">{movieData.description}</p>
              
              {movieData.trailer && (
                <a href={movieData.trailer} target="_blank" rel="noopener noreferrer" className="seatchart__trailer-btn">
                  <i className="fas fa-play-circle"></i> Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="seatchart__categories">
          <div className="seatchart__category seatchart__category--executive">
            <div className="seatchart__category-icon">
              <i className="fas fa-crown"></i>
            </div>
            <div className="seatchart__category-info">
              <div className="seatchart__category-name">Executive</div>
              <div className="seatchart__category-price">
                {formatPrice(ethers.utils.formatEther(occasion.cost))}
              </div>
            </div>
          </div>
          <div className="seatchart__category seatchart__category--premium">
            <div className="seatchart__category-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="seatchart__category-info">
              <div className="seatchart__category-name">Premium</div>
              <div className="seatchart__category-price">
                {formatPrice(ethers.utils.formatEther(occasion.cost))}
              </div>
            </div>
          </div>
          <div className="seatchart__category seatchart__category--normal">
            <div className="seatchart__category-icon">
              <i className="fas fa-couch"></i>
            </div>
            <div className="seatchart__category-info">
              <div className="seatchart__category-name">Normal</div>
              <div className="seatchart__category-price">
                {formatPrice(ethers.utils.formatEther(occasion.cost))}
              </div>
            </div>
          </div>
        </div>

        <div className="seatchart__seats-wrapper">
          <div className="seatchart__screen-container">
            <div className="seatchart__screen">
              <span>SCREEN</span>
            </div>
            <div className="seatchart__screen-glow"></div>
          </div>
          
          <div className="seatchart__legend">
            <div className="seatchart__label">
              <div className="seatchart__sample seatchart__sample--available"></div>
              <span>Available</span>
            </div>
            <div className="seatchart__label">
              <div className="seatchart__sample seatchart__sample--selected"></div>
              <span>Selected</span>
            </div>
            <div className="seatchart__label">
              <div className="seatchart__sample seatchart__sample--taken"></div>
              <span>Taken</span>
            </div>
          </div>

          <div className={`seatchart__seats ${isMobile ? 'seatchart__seats--mobile' : ''}`} ref={seatsContainerRef}>
            {/* Executive Section */}
            <div className="seatchart__section">
              <div className="seatchart__section-label">
                <i className="fas fa-crown"></i> Executive Section
              </div>
              <div className={`seatchart__container seatchart__container--executive ${isMobile ? 'seatchart__container--mobile' : ''}`}>
                {Array(15).fill(0).map((_, i) => (
          <Seat
                    key={i + 1}
                    i={i + 1}
            seatsTaken={seatsTaken}
                    buyHandler={() => {
                      setSelectedSeat(i + 1)
                    }}
                    isLoading={isLoading}
                    step={i+1 === selectedSeat}
                    category="EXECUTIVE"
                    price={getSeatPrice(i+1)}
                    setSelectedSeat={setSelectedSeat}
                    id={`seat-${i+1}`}
                  />
                ))}
              </div>
            </div>
           
            <div className="walkway">
              <div className="walkway__line"></div>
              <span>WALKWAY</span>
              <div className="walkway__line"></div>
        </div>

            {/* Premium Section */}
            <div className="seatchart__section">
              <div className="seatchart__section-label">
                <i className="fas fa-star"></i> Premium Section
              </div>
              <div className={`seatchart__container seatchart__container--premium ${isMobile ? 'seatchart__container--mobile' : ''}`}>
                {Array(40).fill(0).map((_, i) => (
          <Seat
                    key={i + 16}
                    i={i + 16}
            seatsTaken={seatsTaken}
                    buyHandler={() => {
                      setSelectedSeat(i + 16)
                    }}
                    isLoading={isLoading}
                    step={i+16 === selectedSeat}
                    category="PREMIUM"
                    price={getSeatPrice(i+16)}
                    setSelectedSeat={setSelectedSeat}
                    id={`seat-${i+16}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="walkway">
              <div className="walkway__line"></div>
              <span>WALKWAY</span>
              <div className="walkway__line"></div>
        </div>

            {/* Normal Section */}
            <div className="seatchart__section">
              <div className="seatchart__section-label">
                <i className="fas fa-couch"></i> Normal Section
              </div>
              <div className={`seatchart__container seatchart__container--normal ${isMobile ? 'seatchart__container--mobile' : ''}`}>
                {Array(45).fill(0).map((_, i) => (
          <Seat
                    key={i + 56}
                    i={i + 56}
            seatsTaken={seatsTaken}
                    buyHandler={() => {
                      setSelectedSeat(i + 56)
                    }}
                    isLoading={isLoading}
                    step={i+56 === selectedSeat}
                    category="NORMAL"
                    price={getSeatPrice(i+56)}
                    setSelectedSeat={setSelectedSeat}
                    id={`seat-${i+56}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {selectedSeat && (
            <div className="seatchart__selected-info" ref={selectedSeatRef}>
              <div className="seatchart__selected-seat">
                <span>Selected Seat: #{selectedSeat}</span>
                <span>({getSeatCategory(selectedSeat).name})</span>
                <span>Price: {formatPrice(getSeatPrice(selectedSeat))}</span>
              </div>
              <button 
                className="seatchart__purchase-btn pulse-animation"
                onClick={initiatePurchase}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Messages */}
      {showSuccessMessage && (
        <div className="alert alert--success">
          <i className="fas fa-check-circle"></i>
          Your ticket has been successfully purchased! Check your wallet for the NFT ticket.
        </div>
      )}
      
      {insufficientFunds && (
        <div className="alert alert--error">
          <i className="fas fa-exclamation-circle"></i>
          Insufficient funds in your wallet to purchase this ticket. Please add more Sepolia ETH and try again.
        </div>
      )}
      
      {transactionError && !insufficientFunds && (
        <div className="alert alert--error">
          <i className="fas fa-exclamation-circle"></i>
          {transactionError}
        </div>
      )}
      
      {/* Transaction in progress overlay */}
      {transactionInProgress && !showSuccessMessage && (
        <div className="transaction-overlay">
          <div className="transaction-overlay__content">
            <div className="transaction-overlay__spinner"></div>
            <h3>Processing Your Transaction</h3>
            <p>Please wait while we process your transaction. Do not close this window.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeatChart;