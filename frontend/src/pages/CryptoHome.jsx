import React, { useEffect, useRef } from 'react';
import { Shield, DollarSign, Zap, Target, Bell, Search, Flame, Timer, CheckCircle, XCircle, TrendingUp, MessageCircle, Eye } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ProgressBar = ({ value, max, color }) => (
  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
    <div
      className={`h-2 rounded-full transition-all duration-500 ${color}`}
      style={{ width: `${(value / max) * 100}%` }}
      aria-valuenow={value}
      aria-valuemax={max}
      aria-label="Progress bar"
    />
  </div>
);

const CryptoHome = ({
  impactMetrics,
  rumors,
  filteredRumors,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  getConfidenceColor,
  getRiskColor,
  handleVote
}) => {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const rumorRefs = useRef({});

  // Scroll to highlighted rumor when component mounts
  useEffect(() => {
    if (highlightId && rumorRefs.current[highlightId]) {
      setTimeout(() => {
        rumorRefs.current[highlightId].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        // Add highlight effect
        rumorRefs.current[highlightId].classList.add('ring-2', 'ring-orange-500', 'ring-opacity-50');
        setTimeout(() => {
          rumorRefs.current[highlightId].classList.remove('ring-2', 'ring-orange-500', 'ring-opacity-50');
        }, 3000);
      }, 500);
    }
  }, [highlightId]);

  return (
  <div className="space-y-12 animate-fade-in">
    {/* Real-Time Impact Dashboard */}
    <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">CryptoTruth <span className="text-orange-500">Impact Dashboard</span></h1>
        <p className="text-slate-300 text-lg">Real-time community protection metrics</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="bg-slate-700/60 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform" aria-label="Lives Saved">
          <div className="flex items-center justify-center mb-2" title="Total lives protected by the community">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">{impactMetrics.livesSaved.toLocaleString()}</div>
          <div className="text-green-400 text-sm font-medium">Lives Saved</div>
        </div>
        <div className="bg-slate-700/60 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform" aria-label="Money Protected">
          <div className="flex items-center justify-center mb-2" title="Total money protected by the platform">
            <DollarSign className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">${(impactMetrics.moneyProtected / 1000000).toFixed(1)}M</div>
          <div className="text-orange-400 text-sm font-medium">Money Protected</div>
        </div>
        <div className="bg-slate-700/60 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform" aria-label="Truth Speed">
          <div className="flex items-center justify-center mb-2" title="Average time to verify a rumor">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">{impactMetrics.truthSpeed.toFixed(1)}min</div>
          <div className="text-blue-400 text-sm font-medium">Truth Speed</div>
        </div>
        <div className="bg-slate-700/60 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform" aria-label="Accuracy Rate">
          <div className="flex items-center justify-center mb-2" title="Community accuracy rate">
            <Target className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1 flex items-center justify-center">
            {impactMetrics.accuracyRate}%
            {/* Mini trendline placeholder */}
            <TrendingUp className="w-5 h-5 text-green-400 ml-2" title="Accuracy trend" />
          </div>
          <div className="text-purple-400 text-sm font-medium">Accuracy Rate</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3" title="Active users">
          <span className="text-slate-300">Active Users</span>
          <span className="text-white font-medium">{impactMetrics.activeUsers.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3" title="Total verifications">
          <span className="text-slate-300">Total Verifications</span>
          <span className="text-white font-medium">{impactMetrics.totalVerifications.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3" title="Average verification time">
          <span className="text-slate-300">Avg Verification Time</span>
          <span className="text-white font-medium">{impactMetrics.avgVerificationTime}s</span>
        </div>
        <div className="flex flex-col justify-center bg-slate-700/30 rounded-lg p-3" title="Community growth">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Community Growth</span>
            <span className="text-green-400 font-medium">+{impactMetrics.communityGrowth}%</span>
          </div>
          <ProgressBar value={impactMetrics.communityGrowth} max={100} color="bg-green-400" />
        </div>
      </div>
    </section>
    {/* Trending & Filters */}
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" aria-label="Search icon" />
            <input
              type="text"
              placeholder="Search rumors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Search rumors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Select category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Flame className="w-4 h-4 text-orange-400" aria-label="Trending" />
            <span className="text-slate-300">Trending Now</span>
          </div>
          <div className="text-slate-400 text-sm">
            {filteredRumors.length} active rumors
          </div>
        </div>
      </div>
    </section>
    {/* Enhanced Rumors Grid */}
    <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {filteredRumors.map(rumor => (
        <div
          key={rumor.id}
          ref={el => rumorRefs.current[rumor.id] = el}
          className={`bg-slate-800 rounded-xl p-6 border transition-all shadow-lg hover:scale-105 hover:shadow-orange-500/20 ${
            rumor.trending ? 'border-orange-500/50 shadow-orange-500/20' : 'border-slate-700 hover:border-orange-500/30'
          } animate-fade-in`}
          aria-label={`Rumor card: ${rumor.content}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded" title="Category">
                {rumor.category}
              </span>
              {rumor.trending && (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded flex items-center" title="Trending rumor">
                  <Flame className="w-3 h-3 mr-1" /> Trending
                </span>
              )}
              {rumor.urgent && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded animate-pulse" title="Urgent rumor">
                  URGENT
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-slate-400 text-sm">
              <Timer className="w-4 h-4" aria-label="Time left" />
              <span>{rumor.timeLeft}</span>
            </div>
          </div>
          <p className="text-white mb-4 font-medium" title={rumor.content}>{rumor.content.length > 80 ? rumor.content.slice(0, 77) + '...' : rumor.content}</p>
          {/* ...other rumor details, buttons, etc. (copy from crypto.jsx) ... */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleVote(rumor.id, 'true')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                rumor.userVoted === 'true'
                  ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-green-500/20 hover:text-green-400'
              } focus:outline-none focus:ring-2 focus:ring-green-400`}
              aria-label="Vote True"
            >
              Vote True
            </button>
            <button
              onClick={() => handleVote(rumor.id, 'false')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                rumor.userVoted === 'false'
                  ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-400'
              } focus:outline-none focus:ring-2 focus:ring-red-400`}
              aria-label="Vote False"
            >
              Vote False
            </button>
          </div>
          <div className="pt-4 border-t border-slate-700 text-sm text-slate-400 flex justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1" title="Comments">
                <MessageCircle className="w-4 h-4" />
                <span>{rumor.comments}</span>
              </div>
              <div className="flex items-center space-x-1" title="Evidence count">
                <Eye className="w-4 h-4" />
                <span>{rumor.evidence.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-orange-400" title="Viral Score">
              <TrendingUp className="w-4 h-4" />
              <span>{rumor.viralScore || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  </div>
  );
};

export default CryptoHome;