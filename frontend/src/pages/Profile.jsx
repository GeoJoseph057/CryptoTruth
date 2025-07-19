import React from 'react';
import { User } from 'lucide-react';
import { useAccount } from 'wagmi';

function truncateAddress(address) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

const Profile = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
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
    </div>
  );
};

export default Profile;