# CryptoTruth 🔍

> A decentralized platform for verifying crypto rumors using AI, community voting, expert oracles, and portfolio protection tools.

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.0-38B2AC.svg)](https://tailwindcss.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.0-orange.svg)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Overview

CryptoTruth is a comprehensive decentralized platform that addresses the challenge of misinformation in the cryptocurrency space. By combining artificial intelligence, community consensus, expert insights, and blockchain technology, it provides users with reliable tools to verify rumors, protect portfolios, and make informed decisions.

### Why CryptoTruth?

- **🔍 AI-Powered Analysis**: Each rumor undergoes intelligent analysis for confidence scoring and risk assessment
- **🤝 Community-Driven**: Earn rewards for accurate predictions through community voting
- **👨‍💼 Expert Insights**: Access verified crypto expert opinions and consensus
- **🛡️ Portfolio Protection**: AI-powered alerts and recommendations to safeguard your investments
- **⚡ Real-Time Integration**: Live market data showing rumor impact on token prices
- **🔗 Web3 Native**: Seamless wallet integration with MetaMask, WalletConnect, and more

## ✨ Features

### Core Functionality
- **Rumor Verification System**: Submit, search, and vote on crypto rumors with AI analysis
- **Community Voting**: Participate in rumor verification and earn rewards for accuracy
- **Expert Oracle Network**: Access insights from verified crypto experts and analysts
- **Truth Battles**: Compete in verification competitions and join specialized guilds
- **Portfolio Shield**: AI-powered portfolio protection with real-time alerts
- **Live Market Integration**: Real-time price impact analysis for verified rumors

### User Experience
- **Wallet Integration**: Connect with MetaMask, WalletConnect, and other popular wallets
- **Network Indicators**: Visual network status with color-coded indicators
- **Responsive Design**: Fully responsive UI optimized for all devices
- **Real-Time Updates**: Live data feeds and instant notifications

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI framework with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful and consistent icon library
- **RainbowKit** - Wallet connection and management
- **Wagmi** - React hooks for Ethereum
- **Ethers.js** - Ethereum library for blockchain interactions

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data persistence
- **JWT** - Authentication and authorization
- **Web3.js** - Ethereum JavaScript API

### Blockchain
- **Solidity** - Smart contract development language
- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Secure smart contract libraries
- **Sepolia Testnet** - Ethereum test network for development

## 💻 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Deploy smart contracts (optional)**
   ```bash
   cd smart-contracts
   npx hardhat compile
   npx hardhat deploy --network sepolia
   ```

### Production Build

```bash
cd frontend
npm run build
npm run preview
```


## 🔗 Smart Contracts

### GUIToken.sol
ERC-20 token for platform rewards and governance.

### RumorVerification.sol
Core contract managing rumor verification, voting, and reward distribution.

### Key Functions
- `submitRumor()` - Submit new rumors for verification
- `vote()` - Vote on rumor accuracy
- `claimRewards()` - Claim earned rewards
- `getRumorDetails()` - Retrieve rumor information

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Rumor Endpoints
- `GET /api/rumors` - List all rumors
- `POST /api/rumors` - Submit new rumor
- `GET /api/rumors/:id` - Get specific rumor
- `PUT /api/rumors/:id/vote` - Vote on rumor

### Leaderboard Endpoints
- `GET /api/leaderboard` - Get community rankings
- `GET /api/stats` - Platform statistics

<div align="center">

 Made with ❤️ 

</div>
