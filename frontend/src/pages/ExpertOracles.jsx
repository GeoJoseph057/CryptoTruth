import React from 'react';
import { Crown } from 'lucide-react';

const ExpertOracles = ({ expertOracles }) => (
  <div className="space-y-12 animate-fade-in">
    <section className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Expert Oracle System</h2>
      <p className="text-slate-400 text-lg">Verified crypto experts providing professional insights</p>
    </section>
    <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {expertOracles.map(expert => (
        <div key={expert.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:scale-105 hover:shadow-orange-500/20 transition-all animate-fade-in" aria-label={`Expert card: ${expert.name}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center" title="Expert avatar">
              <span className="text-white font-bold text-xl">{expert.avatar}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-lg">{expert.name}</h3>
                {expert.verified && (
                  <Crown className="w-5 h-5 text-yellow-400" title="Verified expert" />
                )}
              </div>
              <div className="text-slate-400 text-sm">{expert.followers.toLocaleString()} followers</div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between" title="Reputation">
              <span className="text-slate-300">Reputation:</span>
              <span className="text-green-400 font-medium">{expert.reputation}</span>
            </div>
            <div className="flex items-center justify-between" title="Accuracy">
              <span className="text-slate-300">Accuracy:</span>
              <span className="text-blue-400 font-medium">{expert.accuracy}%</span>
            </div>
            <div className="flex items-center justify-between" title="Predictions">
              <span className="text-slate-300">Predictions:</span>
              <span className="text-white font-medium">{expert.recentPredictions}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {expert.expertise.map(skill => (
              <span key={skill} className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded" title={skill}>
                {skill}
              </span>
            ))}
          </div>
          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-orange-400" aria-label="View Expert Analysis">
            View Expert Analysis
          </button>
        </div>
      ))}
    </section>
  </div>
);

export default ExpertOracles;