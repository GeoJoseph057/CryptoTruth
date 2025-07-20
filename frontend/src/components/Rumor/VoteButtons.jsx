import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const VoteButtons = ({ rumorId, onVote, hasVoted }) => {
  const handleVote = (vote) => {
    if (hasVoted) {
      window.showToast('You have already voted on this rumor!', 'warning', 3000);
      return;
    }
    onVote(rumorId, vote);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleVote('true')}
        disabled={hasVoted}
        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        <CheckCircle size={20} />
        <span>Vote True</span>
      </button>

      <button
        onClick={() => handleVote('false')}
        disabled={hasVoted}
        className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        <XCircle size={20} />
        <span>Vote False</span>
      </button>
    </div>
  );
};

export default VoteButtons;