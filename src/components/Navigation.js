import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const Navigation = ({ account, setAccount, provider }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const connectHandler = async () => {
    try {
      // Request Sepolia network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet chainId
      }).catch(async (error) => {
        if (error.code === 4902) {
          // If the Sepolia network is not added, add it
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
      });
      
      // Connect to the wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const disconnectHandler = () => {
    setAccount(null);
  };

  // Format account address for display
  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  // Function to view account on Etherscan
  const viewOnEtherscan = () => {
    if (account) {
      const network = provider?._network?.name === 'sepolia' ? 'sepolia.' : '';
      window.open(`https://${network}etherscan.io/address/${account}`, '_blank');
    }
  };

  const homeHandler = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <a href="/" className="navbar__logo" onClick={(e) => { e.preventDefault(); refreshPage(); }}>
          <img src={logo} alt='Logo' />
          <h1>Cinefy</h1>
        </a>

        <div className={`navbar__menu ${isMobileMenuOpen ? 'navbar__menu--active' : ''}`}>
          <a href="/" className="navbar__link" onClick={(e) => { e.preventDefault(); homeHandler(); }}>Home</a>
          <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="navbar__link">Blockchain</a>
          <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer" className="navbar__link">Get Test ETH</a>
          
          {/* In mobile menu, show account/connect button here */}
          {window.innerWidth <= 768 && (
            account ? (
              <div className="navbar__wallet navbar__wallet--mobile">
                <div className="navbar__address" onClick={viewOnEtherscan} title="View on Etherscan">
                  {formatAddress(account)}
                </div>
                <button 
                  className="navbar__wallet-btn" 
                  onClick={disconnectHandler}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="navbar__wallet-btn navbar__wallet-btn--mobile pulse-animation" 
                onClick={connectHandler}
              >
                Connect Wallet
              </button>
            )
          )}
        </div>

        {/* On desktop, show account/connect button here */}
        {window.innerWidth > 768 && (
          account ? (
            <div className="navbar__wallet">
              <div className="navbar__address" onClick={viewOnEtherscan} title="View on Etherscan">
                {formatAddress(account)}
              </div>
              <button 
                className="navbar__wallet-btn" 
                onClick={disconnectHandler}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              className="navbar__wallet-btn pulse-animation" 
              onClick={connectHandler}
            >
              Connect Wallet
            </button>
          )
        )}

        <div 
          className={`navbar__toggle ${isMobileMenuOpen ? 'navbar__toggle--active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;