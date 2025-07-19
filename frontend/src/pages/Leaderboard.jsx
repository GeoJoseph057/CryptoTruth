import React from 'react';
import { Trophy, Award, Star, User } from 'lucide-react';

const Leaderboard = ({ leaderboard }) => (
  <div className="space-y-12 animate-fade-in">
    <section className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Leaderboard</h2>
      <p className="text-slate-400 text-lg">Top performers in the CryptoTruth community</p>
    </section>
    <section className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Rank</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Address</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Reputation</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Accuracy</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Total Earned</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.rank} className={`border-t border-slate-700 ${index < 3 ? 'bg-gradient-to-r from-orange-500/5 to-transparent' : ''} hover:bg-slate-700/30 transition-colors animate-fade-in`} aria-label={`Leaderboard row: ${user.address}`}>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" title="1st Place" />}
                    {index === 1 && <Award className="w-5 h-5 text-slate-400" title="2nd Place" />}
                    {index === 2 && <Star className="w-5 h-5 text-orange-400" title="3rd Place" />}
                    <span className="text-white font-medium">#{user.rank}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-mono" title={user.address}>{user.address.length > 12 ? user.address.slice(0, 8) + '…' + user.address.slice(-4) : user.address}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-green-400 font-medium">{user.reputation}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-blue-400 font-medium">{user.accuracy}%</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-orange-400 font-medium">{user.totalEarned.toFixed(1)} ETH</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

export default Leaderboard;