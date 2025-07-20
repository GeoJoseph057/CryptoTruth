import React from 'react';
import { User, Clock, FileText } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function truncateAddress(address) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

const Profile = ({ rumors = [] }) => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  // Filter rumors submitted by the current user
  const userRumors = rumors.filter(rumor =>
    rumor.submitter && rumor.submitter.toLowerCase() === address?.toLowerCase()
  );

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  const handleRumorClick = (rumorId) => {
    // Navigate to home page with the rumor ID as a query parameter
    navigate(`/?highlight=${rumorId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Profile</h2>
        {isConnected ? (
          <>
            <p className="text-slate-400 mb-2">Connected Wallet Address:</p>
            <p className="text-white font-mono text-lg" title={address}>{truncateAddress(address)}</p>
          </>
        ) : (
          <p className="text-slate-400">Please connect your wallet to view your profile.</p>
        )}
      </div>

      {/* User Submitted Rumors */}
      {isConnected && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-bold text-white">Your Submitted Rumors</h3>
            <span className="ml-auto text-slate-400 text-sm">
              {userRumors.length} rumors
            </span>
          </div>

          {userRumors.length > 0 ? (
            <div className="space-y-4">
              {userRumors.map((rumor) => (
                <div
                  key={rumor.id}
                  className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:bg-slate-600 cursor-pointer transition-colors"
                  onClick={() => handleRumorClick(rumor.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium flex-1">{rumor.content}</h4>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {rumor.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Posted {formatTimestamp(rumor.createdAt)}
                      </span>
                      <span>True: {rumor.trueVotes} | False: {rumor.falseVotes}</span>
                    </div>
                  </div>

                  {rumor.tags && rumor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {rumor.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No rumors submitted yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;