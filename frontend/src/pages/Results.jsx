import React from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const Results = ({ results }) => (
  <div className="space-y-12 animate-fade-in">
    <section className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Resolved Rumors</h2>
      <p className="text-slate-400 text-lg">See how the community performed on past predictions</p>
    </section>
    <section className="space-y-8 animate-fade-in">
      {results.map(result => (
        <div key={result.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:scale-105 hover:shadow-orange-500/20 transition-all animate-fade-in" aria-label={`Result card: ${result.content}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-white font-medium mb-2" title={result.content}>{result.content.length > 80 ? result.content.slice(0, 77) + '...' : result.content}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-slate-400">Resolved {result.resolved}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">Community Accuracy: {result.accuracy}%</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              result.outcome
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`} title={result.outcome ? 'TRUE' : 'FALSE'}>
              {result.outcome ? 'TRUE' : 'FALSE'}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">True Votes</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-xl font-bold text-white">{result.finalVotes.true}</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">False Votes</span>
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-xl font-bold text-white">{result.finalVotes.false}</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Total Rewards</span>
                <Award className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-xl font-bold text-white">{result.totalReward.toFixed(1)} ETH</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default Results;