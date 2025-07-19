# 🚀 CryptoTruth MVP Deployment Guide

This guide will walk you through deploying the complete CryptoTruth MVP to production.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- MetaMask or other Web3 wallet
- Sepolia testnet ETH for initial deployment
- MongoDB Atlas account (for production database)
- Vercel account (for frontend)
- Railway/Render account (for backend)
- Infura/Alchemy account (for blockchain RPC)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│   (Sepolia)     │
│   React + Vite  │    │   Node.js API   │    │   Smart         │
│   Port: 3000    │    │   Port: 3001    │    │   Contracts     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (MongoDB)     │
                       │   Atlas         │
                       └─────────────────┘
```

## 🔧 Step 1: Smart Contract Deployment

### 1.1 Prepare Environment

```bash
cd smart-contracts
cp env.example .env
```

Edit `.env` with your configuration:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 1.2 Deploy Contracts

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### 1.3 Verify Contracts

After deployment, you'll get contract addresses. Verify them on Etherscan:

```bash
# Verify GUI Token
npx hardhat verify --network sepolia DEPLOYED_GUI_TOKEN_ADDRESS

# Verify RumorVerification (with GUI token address as constructor parameter)
npx hardhat verify --network sepolia DEPLOYED_VERIFICATION_ADDRESS "GUI_TOKEN_ADDRESS"
```

### 1.4 Save Deployment Info

The deployment script creates a `deployment-sepolia.json` file. Save these addresses for the next steps.

## 🗄️ Step 2: Database Setup

### 2.1 MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster (M0 Free tier works for MVP)
3. Create a database user with read/write permissions
4. Get your connection string

### 2.2 Database Configuration

The backend will automatically create the necessary collections when it first connects.

## ⚙️ Step 3: Backend Deployment

### 3.1 Railway Deployment (Recommended)

1. **Connect Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure Environment Variables**
   ```env
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptotruth
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   WEB3_PROVIDER_URL=https://sepolia.infura.io/v3/your_project_id
   GUI_TOKEN_ADDRESS=0x... # From deployment
   VERIFICATION_CONTRACT_ADDRESS=0x... # From deployment
   ADMIN_WALLET=0x... # Your admin wallet
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

3. **Deploy**
   - Railway will automatically deploy when you push to main branch
   - Get your backend URL (e.g., `https://cryptotruth-backend.railway.app`)

### 3.2 Alternative: Render Deployment

1. **Create New Web Service**
   - Go to [Render.com](https://render.com)
   - Connect your repository
   - Select the `backend` directory

2. **Configure Service**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Set Environment Variables** (same as Railway)

## 🌐 Step 4: Frontend Deployment

### 4.1 Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_CHAIN_ID=11155111
   VITE_GUI_TOKEN_ADDRESS=0x... # From deployment
   VITE_VERIFICATION_CONTRACT_ADDRESS=0x... # From deployment
   VITE_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
   ```

4. **Deploy**
   - Vercel will automatically deploy on push to main
   - Get your frontend URL (e.g., `https://cryptotruth.vercel.app`)

### 4.2 Update Backend CORS

Update your backend environment variable:
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🔗 Step 5: Connect Everything

### 5.1 Update Frontend Environment

After getting your backend URL, update the frontend environment:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 5.2 Test the Complete Flow

1. **Visit your frontend URL**
2. **Connect wallet** (MetaMask with Sepolia network)
3. **Get GUI tokens** from the faucet
4. **Submit a test rumor**
5. **Vote on rumors**
6. **Test the complete user flow**

## 📊 Step 6: Monitoring & Analytics

### 6.1 Backend Monitoring

Railway/Render provides built-in monitoring:
- Logs
- Performance metrics
- Error tracking

### 6.2 Frontend Analytics

Add Google Analytics to your frontend:

1. **Create GA4 Property**
2. **Add tracking code** to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 6.3 Blockchain Monitoring

- **Etherscan**: Monitor contract interactions
- **Tenderly**: Advanced blockchain monitoring
- **Alchemy**: Enhanced RPC with analytics

## 🔐 Step 7: Security Checklist

### 7.1 Environment Variables
- [ ] All sensitive data in environment variables
- [ ] No hardcoded private keys
- [ ] JWT secret is strong and unique
- [ ] Database connection string is secure

### 7.2 Smart Contracts
- [ ] Contracts verified on Etherscan
- [ ] Admin functions properly secured
- [ ] Reentrancy protection implemented
- [ ] Access control in place

### 7.3 API Security
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Helmet security headers

### 7.4 Frontend Security
- [ ] Environment variables prefixed with VITE_
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Content Security Policy

## 🚀 Step 8: Production Launch

### 8.1 Pre-Launch Checklist

- [ ] All components deployed and tested
- [ ] Smart contracts verified
- [ ] Database populated with initial data
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Performance optimized
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified

### 8.2 Launch Sequence

1. **Deploy to mainnet** (when ready):
   ```bash
   cd smart-contracts
   npm run deploy:mainnet
   ```

2. **Update environment variables** with mainnet addresses

3. **Announce launch** on social media

4. **Monitor closely** for first 24 hours

### 8.3 Post-Launch

- Monitor user activity
- Gather feedback
- Fix any issues quickly
- Plan next iteration

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment
   - Ensure CORS middleware is configured

2. **Contract Interaction Failures**
   - Verify contract addresses
   - Check network configuration
   - Ensure user has enough ETH for gas

3. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access
   - Ensure database user has correct permissions

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

### Support Resources

- **Documentation**: Check README files in each directory
- **GitHub Issues**: Report bugs and request features
- **Community**: Join Discord for support
- **Monitoring**: Use built-in monitoring tools

## 📈 Scaling Considerations

### When to Scale

- **Users**: 100+ daily active users
- **Transactions**: 1000+ daily transactions
- **Storage**: 1GB+ database size

### Scaling Options

1. **Database**: Upgrade MongoDB Atlas tier
2. **Backend**: Add more Railway/Render instances
3. **Frontend**: Vercel handles scaling automatically
4. **Blockchain**: Consider Layer 2 solutions

## 🎯 Success Metrics

Track these KPIs after launch:

- **Daily Active Users**
- **Rumor Submission Rate**
- **Verification Completion Rate**
- **User Retention**
- **Token Circulation**
- **Platform Revenue**

---

**Congratulations! Your CryptoTruth MVP is now live! 🎉**

For ongoing support and updates, check the documentation and join our community.