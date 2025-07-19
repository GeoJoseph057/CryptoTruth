import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, User } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';

const navLinks = [
  { to: '/submit', label: 'Submit' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/results', label: 'Results' },
  { to: '/battles', label: 'Truth Battles' },
  { to: '/experts', label: 'Expert Oracles' },
  { to: '/portfolio', label: 'Portfolio Shield' },
];

const networkIcons = {
  mainnet: '🟢',
  sepolia: '🟣',
  goerli: '🟡',
  polygon: '🟪',
  arbitrum: '🔵',
  optimism: '🔴',
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();

  // Get a simple network symbol
  const networkSymbol = chain?.name && networkIcons[chain.name.toLowerCase()] ? networkIcons[chain.name.toLowerCase()] : '🟢';

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg shadow-slate-900/10 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo as Home link */}
          <NavLink
            to="/"
            className="flex items-center space-x-3 min-w-0 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg"
            aria-label="Home"
            style={{ textDecoration: 'none' }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight truncate">CryptoTruth</span>
          </NavLink>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 flex-shrink-0" aria-label="Main navigation">
            {navLinks.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all border-b-2 ${
                    isActive ? 'bg-orange-500/20 text-orange-400 border-orange-500' : 'text-slate-300 hover:text-white hover:bg-slate-700 border-transparent'
                  }`
                }
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {/* Wallet, Profile, Mobile Menu */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isConnected && (
              <>
                {/* Network symbol */}
                <span className="text-2xl" title={chain?.name || 'Network'} aria-label="Network symbol">{networkSymbol}</span>
                {/* Profile icon button */}
                <button
                  className="p-2 rounded-full bg-slate-700 hover:bg-orange-500/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label="Profile"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-5 h-5" />
                </button>
              </>
            )}
            <ConnectButton showBalance={false} accountStatus={{ smallScreen: 'icon', largeScreen: 'icon' }} chainStatus={{ smallScreen: 'icon', largeScreen: 'icon' }} />
            <button
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 pb-4 w-full overflow-x-hidden">
          <nav className="flex flex-col space-y-1 mt-2" aria-label="Mobile navigation">
            {navLinks.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `mx-4 my-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border-l-4 ${
                    isActive ? 'bg-orange-500/20 text-orange-400 border-orange-500' : 'text-slate-300 hover:text-white hover:bg-slate-700 border-transparent'
                  }`
                }
                aria-label={item.label}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {isConnected && (
              <button
                className="mx-4 my-2 px-3 py-2 rounded-full bg-slate-700 hover:bg-orange-500/20 text-white flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Profile"
                onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;