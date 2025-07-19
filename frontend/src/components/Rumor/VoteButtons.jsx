import React, { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VoteButtons = ({ rumorId }) => {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState('1');
  const [isVoting, setIsVoting] = useState(false);

  const { write: voteTrue, data: trueData } = useContractWrite({
    address: import.meta.env.VITE_RUMOR_VERIFICATION_ADDRESS,
    abi: [
      {
        name: 'vote',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'rumorId', type: 'uint256' },
          { name: 'isTrue', type: 'bool' }
        ],
        outputs: []
      }
    ],
    functionName: 'vote',
  });

  const { write: voteFalse, data: falseData } = useContractWrite({
    address: import.meta.env.VITE_RUMOR_VERIFICATION_ADDRESS,
    abi: [
      {
        name: 'vote',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'rumorId', type: 'uint256' },
          { name: 'isTrue', type: 'bool' }
        ],
        outputs: []
      }
    ],
    functionName: 'vote',
  });

  const { isLoading: trueLoading } = useWaitForTransaction({
    hash: trueData?.hash,
    onSuccess: () => {
      toast.success('Vote submitted successfully!');
      setIsVoting(false);
    },
    onError: () => {
      toast.error('Failed to submit vote');
      setIsVoting(false);
    }
  });

  const { isLoading: falseLoading } = useWaitForTransaction({
    hash: falseData?.hash,
    onSuccess: () => {
      toast.success('Vote submitted successfully!');
      setIsVoting(false);
    },
    onError: () => {
      toast.error('Failed to submit vote');
      setIsVoting(false);
    }
  });

  const handleVote = (isTrue) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid stake amount');
      return;
    }

    setIsVoting(true);

    try {
      if (isTrue) {
        voteTrue({
          args: [rumorId, true],
          value: ethers.utils.parseEther(stakeAmount)
        });
      } else {
        voteFalse({
          args: [rumorId, false],
          value: ethers.utils.parseEther(stakeAmount)
        });
      }
    } catch (error) {
      toast.error('Failed to submit vote');
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stake Amount (GUI)
        </label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter stake amount"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => handleVote(true)}
          disabled={isVoting || trueLoading}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <CheckCircle size={20} />
          <span>Vote True</span>
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={isVoting || falseLoading}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <XCircle size={20} />
          <span>Vote False</span>
        </button>
      </div>

      {(isVoting || trueLoading || falseLoading) && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Processing your vote...
        </div>
      )}
    </div>
  );
};

export default VoteButtons;