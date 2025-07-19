import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Clock, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import VoteButtons from './VoteButtons';
import { formatDistanceToNow } from 'date-fns';

const RumorCard = ({ rumor }) => {
  const { address, isConnected } = useAccount();
  const [showDetails, setShowDetails] = useState(false);

  const timeLeft = new Date(rumor.expiresAt) - new Date();
  const isExpired = timeLeft <= 0;
  const isResolved = rumor.resolved;
  const hasVoted = rumor.userVote?.stake > 0;

  const formatTimeLeft = () => {
    if (isExpired) return 'Expired';
    return formatDistanceToNow(new Date(rumor.expiresAt), { addSuffix: true });
  };

  const getStatusColor = () => {
    if (isResolved) return rumor.outcome ? 'green' : 'red';
    if (isExpired) return 'gray';
    return 'blue';
  };

  const getStatusText = () => {
    if (isResolved) return rumor.outcome ? 'Confirmed True' : 'Confirmed False';
    if (isExpired) return 'Voting Ended';
    return 'Active';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {rumor.content}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {rumor.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            getStatusColor() === 'green' ? 'bg-green-100 text-green-800' :
            getStatusColor() === 'red' ? 'bg-red-100 text-red-800' :
            getStatusColor() === 'gray' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {getStatusText()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {rumor.totalTrueVotes}
              </span>
            </div>
            <div className="text-xs text-gray-500">True Votes</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {rumor.totalFalseVotes}
              </span>
            </div>
            <div className="text-xs text-gray-500">False Votes</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {formatTimeLeft()}
              </span>
            </div>
            <div className="text-xs text-gray-500">Time Left</div>
          </div>
        </div>

        {/* Vote Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Community Sentiment</span>
            <span>
              {rumor.totalTrueVotes + rumor.totalFalseVotes > 0
                ? `${Math.round((rumor.totalTrueVotes / (rumor.totalTrueVotes + rumor.totalFalseVotes)) * 100)}% True`
                : 'No votes yet'
              }
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${rumor.totalTrueVotes + rumor.totalFalseVotes > 0
                  ? (rumor.totalTrueVotes / (rumor.totalTrueVotes + rumor.totalFalseVotes)) * 100
                  : 0}%`
              }}
            />
          </div>
        </div>

        {/* Voting Section */}
        {isConnected && !isResolved && !isExpired && !hasVoted && (
          <VoteButtons rumorId={rumor.id} />
        )}

        {/* User Vote Status */}
        {hasVoted && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Your vote:</span>
              <div className="flex items-center">
                {rumor.userVote.isTrue ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {rumor.userVote.isTrue ? 'True' : 'False'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({rumor.userVote.stake / 1e18} GUI)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details */}
        {showDetails && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Submitted:</span>
                <span className="ml-2 font-medium">
                  {formatDistanceToNow(new Date(rumor.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Total Stake:</span>
                <span className="ml-2 font-medium">
                  {((rumor.totalTrueStake + rumor.totalFalseStake) / 1e18).toFixed(2)} GUI
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-2"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
  );
};

export default RumorCard;