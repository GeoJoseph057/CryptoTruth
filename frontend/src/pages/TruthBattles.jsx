import React from 'react';

const TruthBattles = ({ currentSeason, activeBattles, guilds }) => (
  <div className="space-y-12 animate-fade-in">
    <section className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Truth Battles Arena</h2>
      <p className="text-slate-400 text-lg">Compete in verification competitions and earn glory</p>
    </section>
    {/* Current Season */}
    <section className="bg-gradient-to-r from-purple-900/50 to-orange-900/50 rounded-xl p-8 border border-purple-500/30 shadow-xl mb-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{currentSeason.name}</h3>
        <p className="text-slate-300">Time Left: {currentSeason.timeLeft}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{currentSeason.participants.toLocaleString()}</div>
          <div className="text-slate-300">Participants</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-400 mb-2">{currentSeason.prizePool.toLocaleString()} $GUI</div>
          <div className="text-slate-300">Prize Pool</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">TOP 3</div>
          <div className="text-slate-300">Win: {currentSeason.topPrizes.join(', ')} $GUI</div>
        </div>
      </div>
    </section>
    {/* Active Battles */}
    <section className="grid gap-8 md:grid-cols-2 animate-fade-in">
      {activeBattles.map(battle => (
        <div key={battle.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:scale-105 hover:shadow-orange-500/20 transition-all animate-fade-in" aria-label={`Battle card: ${battle.title}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{battle.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span title="Participants">{battle.participants} participants</span>
                <span>•</span>
                <span title="Time left">{battle.timeLeft} left</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-orange-400 font-bold text-lg">{battle.prizePool} $GUI</div>
              <div className="text-slate-400 text-sm">Prize Pool</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Your Rank:</span>
              <span className="text-white font-medium">#12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Your Score:</span>
              <span className="text-white font-medium">2,450 points</span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-orange-400" aria-label="Join Battle">
              Join Battle
            </button>
          </div>
        </div>
      ))}
    </section>
    {/* Guild Rankings */}
    <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-6">Guild Rankings</h3>
      <div className="space-y-4">
        {guilds.map(guild => (
          <div key={guild.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg shadow hover:scale-105 transition-transform animate-fade-in" aria-label={`Guild: ${guild.name}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-${guild.color}-600 flex items-center justify-center`} title={`Rank #${guild.rank}`}>
                <span className="text-white font-bold">#{guild.rank}</span>
              </div>
              <div>
                <div className="text-white font-medium">{guild.name}</div>
                <div className="text-slate-400 text-sm">{guild.members} members</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">{guild.totalAccuracy}% accuracy</div>
              <div className="text-orange-400 text-sm">{guild.totalEarned.toLocaleString()} $GUI earned</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default TruthBattles;