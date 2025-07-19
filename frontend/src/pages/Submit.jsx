import React from 'react';
import { AlertCircle } from 'lucide-react';

const Submit = ({ newRumor, setNewRumor, aiAnalysis, analyzeRumor, userBalance, handleSubmitRumor }) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <section className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl animate-fade-in">
        <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">Submit New Rumor</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rumor Content</label>
            <textarea
              value={newRumor}
              onChange={(e) => {
                setNewRumor(e.target.value);
                analyzeRumor(e.target.value);
              }}
              placeholder="Enter the rumor you want to verify..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"
              aria-label="Rumor Content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" aria-label="Category">
              <option>Price Prediction</option>
              <option>Technical</option>
              <option>Listings</option>
              <option>Regulations</option>
              <option>Partnerships</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="BTC, ETH, DeFi..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Tags"
            />
          </div>
          {aiAnalysis && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-orange-400 font-medium">AI Analysis Preview</h4>
                  <p className="text-slate-300 text-sm mt-1">{aiAnalysis.length > 120 ? aiAnalysis.slice(0, 117) + '...' : aiAnalysis}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Submission Fee</span>
              <span className="text-orange-400 font-medium">0.01 ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Your Balance</span>
              <span className="text-white font-medium">{userBalance.toFixed(2)} ETH</span>
            </div>
          </div>
          <button
            onClick={handleSubmitRumor}
            disabled={!newRumor.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Submit Rumor"
          >
            Submit Rumor
          </button>
        </div>
      </section>
    </div>
  );
};

export default Submit;