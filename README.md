# CineFy - Blockchain-based Ticket Booking

A decentralized cinema ticket booking application built on blockchain technology that allows users to securely purchase movie tickets as NFTs.

## Features

- Book cinema tickets as NFTs on the blockchain
- Browse available movies
- Select seats via interactive seat chart
- Connect with MetaMask wallet
- View booking history and ticket details
- Smart contract based ticket ownership and validation

## Technology Stack

- **Frontend**: React.js
- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity
- **Testing Framework**: Hardhat
- **Wallet Connection**: MetaMask
- **Web3 Integration**: ethers.js

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MetaMask browser extension
- Hardhat

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/SujithClasher/CineFy-Blockchain-based-ticket-booking.git
   cd CineFy-Blockchain-based-ticket-booking
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_RPC_URL=your_rpc_url
   PRIVATE_KEY=your_private_key
   ```

## Running the Application

### Deploy Smart Contracts

1. Compile the smart contracts:
   ```
   npx hardhat compile
   ```

2. Deploy to local network:
   ```
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```
   
   Or deploy to a testnet (e.g., Sepolia):
   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Start the Frontend

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Connect your MetaMask wallet to interact with the application

## Usage

1. Connect your MetaMask wallet by clicking the "Connect" button
2. Browse available movies
3. Select a movie to view details
4. Choose your preferred seats from the seat chart
5. Confirm the transaction with MetaMask
6. View your tickets in the "My Tickets" section

## Testing

Run the test suite:
```
npx hardhat test
```

## Project Structure

- `/contracts` - Solidity smart contracts
- `/scripts` - Deployment scripts
- `/src` - React frontend application
  - `/components` - React components
  - `/assets` - Images and other static assets
  - `/abis` - Contract ABIs

## License

This project is open source and available under the [MIT License](LICENSE). 