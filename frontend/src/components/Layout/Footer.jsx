import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-800 border-t border-slate-700 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CryptoTruth</span>
          </div>
          <p className="text-slate-400 text-sm">
            The decentralized platform for verifying crypto rumors through AI analysis and community wisdom.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Platform</h4>
          <div className="space-y-2 text-sm">
            <div className="text-slate-400 hover:text-white cursor-pointer">How it Works</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Tokenomics</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Roadmap</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">API</div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Community</h4>
          <div className="space-y-2 text-sm">
            <div className="text-slate-400 hover:text-white cursor-pointer">Discord</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Twitter</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Telegram</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Forum</div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Resources</h4>
          <div className="space-y-2 text-sm">
            <div className="text-slate-400 hover:text-white cursor-pointer">Documentation</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">FAQ</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Support</div>
            <div className="text-slate-400 hover:text-white cursor-pointer">Terms</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 mt-8 pt-8 text-center">
        <p className="text-slate-400 text-sm">
          © 2025 CryptoTruth. All rights reserved. Built with ❤️ for the crypto community.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;