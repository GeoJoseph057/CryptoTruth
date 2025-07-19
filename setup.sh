#!/bin/bash

# CryptoTruth MVP Setup Script
echo "🚀 Setting up CryptoTruth MVP..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Create necessary directories if they don't exist
print_status "Creating project structure..."
mkdir -p smart-contracts/contracts
mkdir -p smart-contracts/scripts
mkdir -p smart-contracts/test
mkdir -p backend/src/{models,routes,middleware,services,utils}
mkdir -p frontend/src/{components,pages,hooks,utils,styles}

# Install smart contract dependencies
print_status "Installing smart contract dependencies..."
cd smart-contracts
if [ -f "package.json" ]; then
    npm install
    print_success "Smart contract dependencies installed"
else
    print_error "package.json not found in smart-contracts directory"
    exit 1
fi
cd ..

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    npm install
    print_success "Backend dependencies installed"
else
    print_error "package.json not found in backend directory"
    exit 1
fi
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
if [ -f "package.json" ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_error "package.json not found in frontend directory"
    exit 1
fi
cd ..

# Copy environment files
print_status "Setting up environment files..."

# Smart contracts
if [ -f "smart-contracts/env.example" ]; then
    if [ ! -f "smart-contracts/.env" ]; then
        cp smart-contracts/env.example smart-contracts/.env
        print_success "Created smart-contracts/.env"
    else
        print_warning "smart-contracts/.env already exists"
    fi
fi

# Backend
if [ -f "backend/env.example" ]; then
    if [ ! -f "backend/.env" ]; then
        cp backend/env.example backend/.env
        print_success "Created backend/.env"
    else
        print_warning "backend/.env already exists"
    fi
fi

# Frontend
if [ -f "frontend/env.example" ]; then
    if [ ! -f "frontend/.env" ]; then
        cp frontend/env.example frontend/.env
        print_success "Created frontend/.env"
    else
        print_warning "frontend/.env already exists"
    fi
fi

# Create additional configuration files
print_status "Creating additional configuration files..."

# Create postcss.config.js for frontend
cat > frontend/postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create .gitignore files
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
out/

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Hardhat files
cache/
artifacts/
typechain/
typechain-types/

# Deployment files
deployment-*.json

# Database
*.db
*.sqlite
EOF

# Create README files for each directory
print_status "Creating README files..."

cat > smart-contracts/README.md << 'EOF'
# Smart Contracts

This directory contains the Solidity smart contracts for CryptoTruth.

## Contracts

- `GUIToken.sol` - ERC-20 token for platform incentives
- `RumorVerification.sol` - Main contract for rumor verification

## Setup

1. Install dependencies: `npm install`
2. Copy environment file: `cp env.example .env`
3. Configure your environment variables
4. Compile contracts: `npm run compile`
5. Run tests: `npm test`
6. Deploy: `npm run deploy:sepolia`

## Testing

```bash
npm test
```

## Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to mainnet
npm run deploy:mainnet
```
EOF

cat > backend/README.md << 'EOF'
# Backend API

Node.js Express server with MongoDB for CryptoTruth.

## Setup

1. Install dependencies: `npm install`
2. Copy environment file: `cp env.example .env`
3. Configure your environment variables
4. Start development server: `npm run dev`

## API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - Wallet authentication
- `GET /api/rumors` - Get all rumors
- `POST /api/rumors` - Create new rumor
- `GET /api/users/:address` - Get user profile
- `GET /api/leaderboard` - Get leaderboard

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```
EOF

cat > frontend/README.md << 'EOF'
# Frontend

React application with Wagmi and RainbowKit for CryptoTruth.

## Setup

1. Install dependencies: `npm install`
2. Copy environment file: `cp env.example .env`
3. Configure your environment variables
4. Start development server: `npm run dev`

## Features

- Wallet connection with RainbowKit
- Rumor submission and voting
- User profiles and leaderboards
- Real-time updates
- Mobile-responsive design

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```
EOF

# Create a comprehensive setup guide
cat > SETUP_GUIDE.md << 'EOF'
# CryptoTruth MVP Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or cloud)
- MetaMask or other Web3 wallet
- Sepolia testnet ETH

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cryptotruth-mvp
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**
   - Edit `smart-contracts/.env`
   - Edit `backend/.env`
   - Edit `frontend/.env`

4. **Deploy smart contracts**
   ```bash
   cd smart-contracts
   npm run deploy:sepolia
   ```

5. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## Environment Configuration

### Smart Contracts (.env)
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Backend (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cryptotruth
JWT_SECRET=your-secret-key
WEB3_PROVIDER_URL=https://sepolia.infura.io/v3/your_project_id
GUI_TOKEN_ADDRESS=0x... # From deployment
VERIFICATION_CONTRACT_ADDRESS=0x... # From deployment
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
VITE_CHAIN_ID=11155111
VITE_GUI_TOKEN_ADDRESS=0x... # From deployment
VITE_VERIFICATION_CONTRACT_ADDRESS=0x... # From deployment
```

## Testing

### Smart Contracts
```bash
cd smart-contracts
npm test
```

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm run build
```

## Deployment

### Smart Contracts (Mainnet)
```bash
cd smart-contracts
npm run deploy:mainnet
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## Troubleshooting

### Common Issues

1. **Node.js version too old**
   - Install Node.js 18+ from https://nodejs.org

2. **MongoDB connection failed**
   - Ensure MongoDB is running locally or use MongoDB Atlas

3. **Contract deployment failed**
   - Check your private key and RPC URL
   - Ensure you have enough Sepolia ETH

4. **Frontend build failed**
   - Check environment variables
   - Ensure all dependencies are installed

### Support

For issues and questions:
- Check the documentation
- Open an issue on GitHub
- Join our Discord community
EOF

print_success "Setup completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Configure environment variables in .env files"
echo "2. Deploy smart contracts: cd smart-contracts && npm run deploy:sepolia"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
print_status "See SETUP_GUIDE.md for detailed instructions"