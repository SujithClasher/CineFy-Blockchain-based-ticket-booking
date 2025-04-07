import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Card from './components/Card';
import SeatChart from './components/SeatChart';

// ABIs
import TokenMaster from './abis/TokenMaster.json';

// Config
import config from './config.json';
import { movieImages } from './assets/images';

// Create mock movie data for demonstration
const createMockMovieData = () => {
  const mockMovies = [];
  const locations = ["PVR Cinemas", "INOX Theatres", "Cinepolis", "Carnival Cinemas"];
  const dates = ["June 10", "June 15", "June 20", "June 25", "July 5"];
  const times = ["10:00AM", "1:00PM", "4:30PM", "7:00PM", "9:45PM"];
  
  // Create movie objects for each movie in images.js
  Object.keys(movieImages).forEach((movieName, index) => {
    // Create a unique ID for each movie
    const id = index + 1;
    
    // Get movie details from images.js
    const movieDetails = movieImages[movieName];
    
    // Random values for demo purposes
    const location = locations[Math.floor(Math.random() * locations.length)];
    const date = dates[Math.floor(Math.random() * dates.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    const maxTickets = 100;
    const tickets = Math.floor(Math.random() * 20); // Some tickets sold
    const cost = ethers.utils.parseUnits("0.0001", "ether"); // Fixed price of 0.0001 ETH
    
    // Create a mock movie object mimicking the contract's structure
    // but with additional details from our images.js file
    mockMovies.push({
      id,
      name: movieName,
      cost,
      tickets,
      maxTickets,
      date,
      time,
      location,
      // Additional fields for UI enhancement
      posterUrl: movieDetails.poster,
      backdropUrl: movieDetails.backdrop,
      description: movieDetails.description,
      genres: movieDetails.genre ? movieDetails.genre.split(', ') : [],
      rating: movieDetails.rating,
      trailer: movieDetails.trailer
    });
  });
  
  return mockMovies;
};

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [cinema, setCinema] = useState({});
  const [allOccasions, setAllOccasions] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const loadBlockchainData = useCallback(async () => {
    try {
      // Initialize provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Request to switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
        });
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
          });
        }
      }

      // Get network and contract
      const network = await provider.getNetwork();
      
      // Use network info to get contract address
      const tokenMasterAddress = config[network.chainId]?.TokenMaster?.address;
      
      if (!tokenMasterAddress) {
        console.error(`No contract address for network ${network.chainId}`);
        setIsLoading(false);
        return;
      }
      
      const tokenMaster = new ethers.Contract(
        tokenMasterAddress,
        TokenMaster,
        provider
      );
      
      // Get occasions from contract
      try {
        const totalOccasions = await tokenMaster.totalOccasions();
        const fetchedOccasions = [];

        for (var i = 1; i <= totalOccasions; i++) {
          const occasion = await tokenMaster.getOccasion(i);
          fetchedOccasions.push(occasion);
        }

        setAllOccasions(fetchedOccasions);
        setCinema(tokenMaster);
        
        // Check if there are matching movies on blockchain
        const hasMatchingMovies = fetchedOccasions.some(occasion => 
          Object.keys(movieImages).includes(occasion.name)
        );
        
        // Check if accounts are connected
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);
          
          // Remove auto-initialization logic here
        }
        
        if (!hasMatchingMovies) {
          setUseMockData(true);
        }
      } catch (error) {
        console.error("Error fetching occasions:", error);
        // Use mock data if there's an error
        setUseMockData(true);
      }
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);
        } else {
          setAccount(null);
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Failed to load blockchain data:", error);
      // Use mock data if there's an error
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set movie data - either from blockchain or mock data
  useEffect(() => {
    if (useMockData) {
      // Use mock data if specified
      const mockMovies = createMockMovieData();
      console.log("Created mock movie data:", mockMovies);
      setOccasions(mockMovies);
    } else if (allOccasions.length > 0) {
      // Only show occasions whose names are defined in movieImages
      const filteredOccasions = allOccasions.filter(occasion => 
        Object.keys(movieImages).includes(occasion.name)
      );
      
      console.log("Filtered blockchain occasions:", filteredOccasions);
      
      if (filteredOccasions.length > 0) {
        // Add poster URLs from movieImages
        const enhancedOccasions = filteredOccasions.map(occasion => {
          const movieImageData = movieImages[occasion.name];
          return {
            ...occasion,
            posterUrl: movieImageData?.poster,
            backdropUrl: movieImageData?.backdrop,
            description: movieImageData?.description,
            rating: movieImageData?.rating,
            genres: movieImageData?.genre ? movieImageData.genre.split(', ') : []
          };
        });
        
        console.log("Enhanced occasions with images:", enhancedOccasions);
        setOccasions(enhancedOccasions);
      } else {
        // Fall back to mock data if no matching movies found
        setUseMockData(true);
      }
    }
  }, [allOccasions, useMockData]);

  useEffect(() => {
    if (window.ethereum) {
      loadBlockchainData();
    } else {
      setIsLoading(false);
      setUseMockData(true); // Use mock data if MetaMask not installed
      console.warn("MetaMask not installed");
    }
  }, [loadBlockchainData]);

  // Set document title
  useEffect(() => {
    document.title = "Cinefy - Blockchain Cinema Tickets";
  }, []);

  return (
    <div className="app" style={{ 
      background: '#1a1a1a', 
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Navigation */}
      <Navigation 
        account={account} 
        setAccount={setAccount} 
        provider={provider} 
      />

      <div className="movies">
        <h2 
          style={{ 
            textAlign: 'center', 
            marginTop: '40px', 
            fontSize: '32px', 
            fontWeight: '600',
            color: 'var(--clr-white)',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '30px'
          }}
        >Latest Releases</h2>

        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '50px 0'
          }}>
            <div className="spinner" style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: 'var(--clr-primary)',
              borderRadius: '50%',
              animation: 'spin 1s infinite linear'
            }}></div>
          </div>
        ) : occasions.length > 0 ? (
          <div className="movies__grid">
            {occasions.map((occasion, index) => (
              <Card
                occasion={occasion}
                key={index}
                setToggle={setToggle}
                setOccasion={setOccasion}
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px 0', 
            color: 'var(--clr-text-light)'
          }}>
            <p>No movies found. Please make sure you're connected to Sepolia testnet.</p>
            <button
              onClick={() => loadBlockchainData()}
              style={{
                background: 'linear-gradient(to right, var(--clr-primary), var(--clr-secondary))',
                color: 'var(--clr-black)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                margin: '20px 0',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Popup seat selection */}
      {toggle && (
        <SeatChart
          cinema={cinema}
          occasion={occasion}
          setToggle={setToggle}
          setTrigger={() => loadBlockchainData()}
        />
      )}

      {/* Copyright notice */}
      <div style={{ 
        textAlign: 'center', 
        padding: '30px 0',
        color: 'var(--clr-text-light)',
        fontSize: '14px'
      }}>
        &copy; {new Date().getFullYear()} Cinefy - Blockchain-Powered Cinema Tickets | <a 
          href="https://sepolia.etherscan.io" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}
        >
          Sepolia
        </a>
      </div>
    </div>
  );
}

export default App;