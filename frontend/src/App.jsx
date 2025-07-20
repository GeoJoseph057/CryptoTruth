import { Routes, Route } from 'react-router-dom';
import Submit from './pages/Submit';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Results from './pages/Results';
import CryptoHome from './pages/CryptoHome';
import TruthBattles from './pages/TruthBattles';
import ExpertOracles from './pages/ExpertOracles';
import PortfolioShield from './pages/PortfolioShield';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ToastContainer from './components/Common/ToastContainer';


// Mock data and handlers for now (to be replaced with backend/API)
import { Search, Clock, CheckCircle, XCircle } from 'lucide-react';

const rumorsData = [
  {
    id: 1,
    content: "Bitcoin will reach $100,000 by end of 2025",
    category: "Price Prediction",
    tags: ["BTC", "Price", "2025"],
    aiConfidence: 72,
    timeLeft: "5 days",
    trueVotes: 1250,
    falseVotes: 890,
    totalReward: 45.5,
    evidence: ["Historical bull run patterns", "Institutional adoption increasing", "Halving cycle analysis"],
    comments: 34,
    userVoted: null,
    resolved: false
  },
  {
    id: 2,
    content: "Ethereum 2.0 will cause major network disruption",
    category: "Technical",
    tags: ["ETH", "ETH2", "Network"],
    aiConfidence: 28,
    timeLeft: "2 days",
    trueVotes: 456,
    falseVotes: 1890,
    totalReward: 78.2,
    evidence: ["Successful testnet operations", "Gradual rollout plan", "Developer consensus"],
    comments: 67,
    userVoted: 'false',
    resolved: false
  },
  {
    id: 3,
    content: "Major exchange will list DOGE as base pair",
    category: "Listings",
    tags: ["DOGE", "Exchange", "Trading"],
    aiConfidence: 55,
    timeLeft: "1 day",
    trueVotes: 789,
    falseVotes: 654,
    totalReward: 32.1,
    evidence: ["Exchange partnership rumors", "Increased DOGE volume", "Social media hints"],
    comments: 23,
    userVoted: 'true',
    resolved: false
  }
];

function App() {
  const { address, isConnected } = useAccount();
  const [rumors, setRumors] = useState(rumorsData);

  // Show toast when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      window.showToast(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`, 'success', 3000);
    }
  }, [isConnected, address]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newRumor, setNewRumor] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [duration, setDuration] = useState(24);
  const [userBalance, setUserBalance] = useState(125.5);
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, address: "0x1234...5678", reputation: 98.5, accuracy: 94.2, totalEarned: 2450.5 },
    { rank: 2, address: "0xabcd...efgh", reputation: 95.8, accuracy: 92.1, totalEarned: 1890.2 },
    { rank: 3, address: "0x9876...5432", reputation: 94.2, accuracy: 89.7, totalEarned: 1654.8 },
    { rank: 4, address: "0xffff...aaaa", reputation: 91.5, accuracy: 88.3, totalEarned: 1432.1 },
    { rank: 5, address: "0x5555...9999", reputation: 89.7, accuracy: 85.9, totalEarned: 1287.4 }
  ]);
  const [userStats, setUserStats] = useState({
    reputation: 87.3,
    totalVotes: 156,
    accuracy: 84.6,
    totalEarned: 892.3,
    rank: 12,
    recentActivity: [
      { type: 'vote', rumor: 'Bitcoin ETF approval', result: 'Correct', reward: 12.5, time: '2 hours ago' },
      { type: 'submit', rumor: 'New DeFi protocol launch', status: 'Active', time: '1 day ago' },
      { type: 'vote', rumor: 'Ethereum merge delay', result: 'Incorrect', reward: -5.2, time: '3 days ago' }
    ]
  });
  const [results] = useState([
    {
      id: 1,
      content: "Tesla will accept Bitcoin payments again in Q4 2024",
      outcome: false,
      finalVotes: { true: 2340, false: 1560 },
      totalReward: 156.7,
      accuracy: 67.2,
      resolved: "2 weeks ago"
    },
    {
      id: 2,
      content: "Major bank will launch crypto custody service",
      outcome: true,
      finalVotes: { true: 1890, false: 1120 },
      totalReward: 89.3,
      accuracy: 78.5,
      resolved: "1 month ago"
    },
    {
      id: 3,
      content: "Ethereum gas fees will drop below 5 gwei",
      outcome: false,
      finalVotes: { true: 1200, false: 2800 },
      totalReward: 112.4,
      accuracy: 82.1,
      resolved: "1 month ago"
    }
  ]);
  const categories = ['all', 'Price Prediction', 'Technical', 'Listings', 'Regulations', 'Partnerships'];

  // Fetch rumors from backend on component mount
  useEffect(() => {
    const fetchRumors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/rumors`);
        if (response.ok) {
          const data = await response.json();
          setRumors(data.rumors || []);
        }
      } catch (error) {
        console.error('Error fetching rumors:', error);
      }
    };

    fetchRumors();
  }, []);

  const filteredRumors = rumors.filter(rumor => {
    const matchesCategory = selectedCategory === 'all' || rumor.category === selectedCategory;
    const matchesSearch = rumor.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rumor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleVote = (rumorId, vote) => {
    setRumors(prev => prev.map(rumor => {
      if (rumor.id === rumorId) {
        // Check if user already voted
        if (rumor.userVoted !== null) {
          window.showToast('You have already voted on this rumor!', 'warning', 3000);
          return rumor;
        }

        // Update vote counts and user vote
        const updatedRumor = { ...rumor, userVoted: vote };
        if (vote === 'true') {
          updatedRumor.trueVotes += 1;
        } else {
          updatedRumor.falseVotes += 1;
        }
        window.showToast(`Vote ${vote === 'true' ? 'True' : 'False'} recorded successfully!`, 'success', 3000);
        return updatedRumor;
      }
      return rumor;
    }));
  };

  const analyzeRumor = (content) => {
    if (content.length > 10) {
      setAiAnalysis(`AI Analysis: This rumor shows ${Math.floor(Math.random() * 100)}% confidence based on market sentiment, technical indicators, and historical patterns.`);
    } else {
      setAiAnalysis('');
    }
  };

  const handleSubmitRumor = async () => {
    if (!newRumor.trim()) return;

    if (!isConnected) {
      window.showToast('Please connect your wallet first', 'error', 4000);
      return;
    }

    try {

      const rumorData = {
        content: newRumor,
        category: category || "Other",
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        duration: duration || 24
      };

      // Add the new rumor to local state
      const now = new Date();
      const newRumorData = {
        id: rumors.length + 1,
        content: newRumor,
        category: category || "Other",
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        aiConfidence: Math.floor(Math.random() * 100),
        timeLeft: `${duration || 24} hours`,
        trueVotes: 0,
        falseVotes: 0,
        totalReward: 0,
        evidence: [],
        comments: 0,
        userVoted: null,
        resolved: false,
        createdAt: now.toISOString(),
        submitter: address // Add the submitter address
      };

      // Add the new rumor to the local state
      setRumors(prev => [newRumorData, ...prev]);
      setNewRumor('');
      setAiAnalysis('');
      setCategory('Other');
      setTags('');
      setDuration(24);

      window.showToast('Rumor submitted successfully!', 'success', 4000);
    } catch (error) {
      console.error('Error submitting rumor:', error);
      window.showToast('Failed to submit rumor. Please try again.', 'error', 4000);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'text-green-400 bg-green-400/10';
    if (confidence >= 40) return 'text-orange-400 bg-orange-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  // Add state for advanced crypto pages
  const [impactMetrics, setImpactMetrics] = useState({
    livesSaved: 12847,
    moneyProtected: 4567890,
    truthSpeed: 3.2,
    accuracyRate: 87.4,
    activeUsers: 2341,
    totalVerifications: 15632,
    avgVerificationTime: 45,
    communityGrowth: 23.5
  });
  const [marketData, setMarketData] = useState({
    btcPrice: 43250,
    ethPrice: 2680,
    priceChanges: {
      'BTC': { change: 2.3, affected: true },
      'ETH': { change: -1.2, affected: false },
      'DOGE': { change: 15.7, affected: true }
    }
  });
  const [expertOracles, setExpertOracles] = useState([
    {
      id: 1,
      name: "Michael Saylor",
      verified: true,
      expertise: ["Bitcoin", "Institution"],
      reputation: 98.5,
      followers: 1200000,
      recentPredictions: 23,
      accuracy: 91.3,
      avatar: "MS"
    },
    {
      id: 2,
      name: "Vitalik Buterin",
      verified: true,
      expertise: ["Ethereum", "Technical"],
      reputation: 99.2,
      followers: 3400000,
      recentPredictions: 18,
      accuracy: 94.7,
      avatar: "VB"
    },
    {
      id: 3,
      name: "Changpeng Zhao",
      verified: true,
      expertise: ["Exchange", "Market"],
      reputation: 95.8,
      followers: 2100000,
      recentPredictions: 31,
      accuracy: 88.2,
      avatar: "CZ"
    }
  ]);
  const [guilds, setGuilds] = useState([
    {
      id: 1,
      name: "Truth Seekers",
      members: 234,
      totalAccuracy: 89.2,
      totalEarned: 45672.3,
      rank: 1,
      color: "orange"
    },
    {
      id: 2,
      name: "Myth Busters",
      members: 189,
      totalAccuracy: 86.7,
      totalEarned: 38291.5,
      rank: 2,
      color: "blue"
    },
    {
      id: 3,
      name: "Fact Hunters",
      members: 156,
      totalAccuracy: 84.1,
      totalEarned: 32456.8,
      rank: 3,
      color: "green"
    }
  ]);
  const [activeBattles, setActiveBattles] = useState([
    {
      id: 1,
      title: "Bitcoin $100K Prediction Battle",
      participants: 45,
      prizePool: 234.5,
      timeLeft: "2 days",
      status: "active"
    },
    {
      id: 2,
      title: "Ethereum Merge Impact Challenge",
      participants: 67,
      prizePool: 189.2,
      timeLeft: "5 days",
      status: "active"
    }
  ]);
  const [portfolioAlerts, setPortfolioAlerts] = useState([
    {
      token: "BTC",
      alert: "Rumor about regulatory crackdown may affect your holdings",
      impact: "Medium Risk",
      recommendation: "Consider reducing position by 20%"
    },
    {
      token: "ETH",
      alert: "Positive institutional adoption rumor verified",
      impact: "High Opportunity",
      recommendation: "Consider increasing position"
    }
  ]);
  const [currentSeason, setCurrentSeason] = useState({
    name: "Season 3: Truth Wars",
    timeLeft: "23 days",
    participants: 4567,
    prizePool: 10000,
    topPrizes: [5000, 3000, 2000]
  });

  // Add getRiskColor for CryptoHome
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-green-400 bg-green-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col px-2 sm:px-0">
        <main className="flex-1 border-8 border-transparent rounded-2xl max-w-7xl mx-auto my-2 w-full bg-slate-900 shadow-xl">
          <Routes>
            <Route path="/" element={
              <CryptoHome
                impactMetrics={impactMetrics}
                rumors={rumors}
                filteredRumors={filteredRumors}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                getConfidenceColor={getConfidenceColor}
                getRiskColor={getRiskColor}
                handleVote={handleVote}
              />
            } />
            <Route path="/battles" element={
              <TruthBattles
                currentSeason={currentSeason}
                activeBattles={activeBattles}
                guilds={guilds}
              />
            } />
            <Route path="/experts" element={
              <ExpertOracles expertOracles={expertOracles} />
            } />
            <Route path="/portfolio" element={
              <PortfolioShield portfolioAlerts={portfolioAlerts} marketData={marketData} />
            } />
            <Route path="/submit" element={
              <Submit
                newRumor={newRumor}
                setNewRumor={setNewRumor}
                aiAnalysis={aiAnalysis}
                analyzeRumor={analyzeRumor}
                userBalance={userBalance}
                handleSubmitRumor={handleSubmitRumor}
                category={category}
                setCategory={setCategory}
                tags={tags}
                setTags={setTags}
                duration={duration}
                setDuration={setDuration}
              />
            } />
            <Route path="/leaderboard" element={<Leaderboard leaderboard={leaderboard} />} />
            <Route path="/results" element={<Results results={results} />} />
            <Route path="/profile" element={<Profile rumors={rumors} />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;