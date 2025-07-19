import React from 'react';
import { AlertCircle, Lightbulb, ArrowUp, ArrowDown } from 'lucide-react';

const PortfolioShield = ({ portfolioAlerts, marketData }) => (
  <div className="space-y-12 animate-fade-in">
    <section className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Portfolio Protection Shield</h2>
      <p className="text-slate-400 text-lg">AI-powered alerts to protect your crypto investments</p>
    </section>
    {/* Active Alerts */}
    <section className="space-y-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-4">Active Portfolio Alerts</h3>
      {portfolioAlerts.map((alert, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:scale-105 hover:shadow-orange-500/20 transition-all animate-fade-in" aria-label={`Portfolio alert: ${alert.token}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                alert.impact === 'High Opportunity' ? 'bg-green-500/20' : 'bg-orange-500/20'
              }`} title={alert.impact}>
                <AlertCircle className={`w-5 h-5 ${
                  alert.impact === 'High Opportunity' ? 'text-green-400' : 'text-orange-400'
                }`} />
              </div>
              <div>
                <h4 className="text-white font-medium">{alert.token}</h4>
                <p className="text-slate-400 text-sm">{alert.alert}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm px-3 py-1 rounded ${
                alert.impact === 'High Opportunity' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
              }`} title={alert.impact}>
                {alert.impact}
              </div>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" title="AI Recommendation" />
              <span className="text-yellow-400 font-medium">AI Recommendation</span>
            </div>
            <p className="text-slate-300 text-sm">{alert.recommendation}</p>
          </div>
        </div>
      ))}
    </section>
    {/* Market Integration */}
    <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-6">Live Market Integration</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(marketData.priceChanges).map(([token, data]) => (
          <div key={token} className="bg-slate-700/50 rounded-lg p-4 shadow hover:scale-105 transition-transform animate-fade-in" aria-label={`Market data: ${token}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{token}</span>
              <div className={`flex items-center space-x-1 ${
                data.change > 0 ? 'text-green-400' : 'text-red-400'
              }`} title={data.change > 0 ? 'Price up' : 'Price down'}>
                {data.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(data.change).toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {data.affected ? 'Affected by verified rumors' : 'No rumor impact'}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default PortfolioShield;