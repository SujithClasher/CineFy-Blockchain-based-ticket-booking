// Utility functions for the application

// Format ETH value to readable format
export const formatETH = (value) => {
  if (!value) return '0 ETH';
  const formatted = parseFloat(value).toFixed(4);
  return `${formatted} ETH`;
};

// Format account address to truncated form
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get network name from chain ID
export const getNetworkName = (chainId) => {
  switch (chainId) {
    case '0x1':
      return 'Ethereum Mainnet';
    case '0xaa36a7':
      return 'Sepolia';
    case '0x5':
      return 'Goerli';
    case '0x13881':
      return 'Mumbai';
    case '0x89':
      return 'Polygon';
    case '0x539':
      return 'localhost';
    default:
      return 'Unknown Network';
  }
};

// Generate random date for next 30 days
export const getRandomDate = () => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
  return formatDate(futureDate);
};

// Format date to readable format (e.g., "15 Mar 2023")
export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Generate random show times
export const getRandomTime = () => {
  const times = ['10:00 AM', '1:30 PM', '4:20 PM', '7:00 PM', '9:30 PM'];
  return times[Math.floor(Math.random() * times.length)];
};

// Generate random cinema locations
export const getRandomLocation = () => {
  const locations = [
    'Grand Cinemas',
    'Regal Theater',
    'AMC Metroplex',
    'IMAX Experience',
    'Cinemark Deluxe',
    'MovieTown Cineplex'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Check if time has passed (for show availability)
export const hasTimePassed = (dateStr, timeStr) => {
  const now = new Date();
  
  // Parse date (assuming format like "15 Mar 2023")
  const [day, month, year] = dateStr.split(' ');
  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  // Parse time (assuming format like "7:00 PM")
  const [timeValue, period] = timeStr.split(' ');
  let [hours, minutes] = timeValue.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  const showDate = new Date(parseInt(year), monthMap[month], parseInt(day), hours, minutes);
  return now > showDate;
};

// Add Sepolia network to metamask
export const addSepoliaNetwork = async () => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: {
          name: 'Sepolia ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      }]
    });
    return true;
  } catch (error) {
    console.error('Error adding Sepolia network:', error);
    return false;
  }
};

// Switch to Sepolia network
export const switchToSepoliaNetwork = async () => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }]
    });
    return true;
  } catch (error) {
    if (error.code === 4902) {
      return await addSepoliaNetwork();
    }
    console.error('Error switching to Sepolia network:', error);
    return false;
  }
}; 