"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FaBolt, FaHeart, FaComment, FaShare, FaSpinner, FaFilter, FaSort, FaLink, FaUsers, FaCamera, FaUpload, FaTimes, FaCheckCircle, FaImage } from 'react-icons/fa';
import Image from 'next/image';
import ChainReactionContractArtifact from '@/abis/ChainReactionContract.json';
import { uploadChainToIPFS } from '@/lib/ipfs';

// Contract address from deployment
const CHAIN_REACTION_CONTRACT_ADDRESS = "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0";

interface Challenge {
  initiator: string;
  prompt: string;
  promptImageIpfsHash: string;
  timestamp: bigint;
  responseIds: bigint[];
  exists: boolean;
}

interface Response {
  responder: string;
  parentChallengeId: bigint;
  parentResponseId: bigint;
  responseText: string;
  responseImageIpfsHash: string;
  timestamp: bigint;
  childResponseIds: bigint[];
  exists: boolean;
}

export default function ChainReactionGallery() {
  const { address, isConnected } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'challenges' | 'create'>('challenges');
  const [challenges, setChallenges] = useState<Array<{ id: number; data: Challenge }>>([]);
  const [responses, setResponses] = useState<Array<{ id: number; data: Response }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, trending
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, responses

  // Form states
  const [promptText, setPromptText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [responseText, setResponseText] = useState('');
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [selectedParentResponseId, setSelectedParentResponseId] = useState<number | null>(null);

  // Read contract data
  const { data: totalChallenges } = useReadContract({
    address: CHAIN_REACTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: ChainReactionContractArtifact.abi,
    functionName: 'totalChallenges',
  });

  const { data: totalResponses } = useReadContract({
    address: CHAIN_REACTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: ChainReactionContractArtifact.abi,
    functionName: 'totalResponses',
  });

  // Write contract functions
  const { writeContract: startChallenge, data: startChallengeHash } = useWriteContract();
  const { writeContract: joinChallenge, data: joinChallengeHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isCreatingChallenge } = useWaitForTransactionReceipt({ hash: startChallengeHash });
  const { isLoading: isJoiningChallenge } = useWaitForTransactionReceipt({ hash: joinChallengeHash });

  // Load challenges
  useEffect(() => {
    const loadChallenges = async () => {
      if (totalChallenges && typeof totalChallenges === 'bigint' && totalChallenges > 0n) {
        try {
          const challengesData = await fetch(`/api/chainreaction/challenges?total=${totalChallenges.toString()}`);
          const challengesList = await challengesData.json();
          setChallenges(challengesList);
        } catch (error) {
          console.error('Error loading challenges:', error);
        }
      }
      setIsLoading(false);
    };
    loadChallenges();
  }, [totalChallenges]);

  // Load responses
  useEffect(() => {
    const loadResponses = async () => {
      if (totalResponses && typeof totalResponses === 'bigint' && totalResponses > 0n) {
        try {
          const responsesData = await fetch(`/api/chainreaction/responses?total=${totalResponses.toString()}`);
          const responsesList = await responsesData.json();
          setResponses(responsesList);
        } catch (error) {
          console.error('Error loading responses:', error);
        }
      }
    };
    loadResponses();
  }, [totalResponses]);

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle camera capture
  const handleCameraCapture = () => {
    // This would integrate with camera API in a real implementation
    alert('Camera capture feature coming soon!');
  };

  // Create challenge
  const handleCreateChallenge = async () => {
    if (!promptText.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      let imageHash = '';
      if (selectedImage) {
        const uploadResult = await uploadChainToIPFS(selectedImage, promptText);
        imageHash = uploadResult.imageHash;
      }

      startChallenge({
        address: CHAIN_REACTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: ChainReactionContractArtifact.abi,
        functionName: 'startChallenge',
        args: [promptText, imageHash],
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge. Please try again.');
    }
  };

  // Join challenge
  const handleJoinChallenge = async () => {
    if (!responseText.trim() && !selectedImage) {
      alert('Please enter a response or upload an image');
      return;
    }

    if (!selectedChallengeId) {
      alert('Please select a challenge to join');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      let imageHash = '';
      if (selectedImage) {
        const uploadResult = await uploadChainToIPFS(selectedImage, responseText);
        imageHash = uploadResult.imageHash;
      }

      joinChallenge({
        address: CHAIN_REACTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: ChainReactionContractArtifact.abi,
        functionName: 'joinChallenge',
        args: [BigInt(selectedChallengeId), BigInt(selectedParentResponseId || 0), responseText, imageHash],
      });
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Failed to join challenge. Please try again.');
    }
  };

  // Clear form
  const clearForm = () => {
    setPromptText('');
    setSelectedImage(null);
    setImagePreview('');
    setResponseText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTimeAgo = (timestamp: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const diffInSeconds = now - timestamp;
    const diffInHours = Number(diffInSeconds) / 3600;
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const getResponseCount = (challengeId: number) => {
    return responses.filter(r => Number(r.data.parentChallengeId) === challengeId).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-vibecaster-lavender mx-auto mb-4" />
          <p className="text-vibecaster-light-purple">Loading chain reactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <FaBolt className="text-yellow-500" />
          Chain Reactions
        </h2>
        <p className="text-vibecaster-light-purple">
          Start viral challenges and watch them spread! Join the fun and create amazing chain reactions!
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center">
        <div className="bg-vibecaster-dark/50 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20">
          <div className="flex">
            <div className="px-4 py-3 text-center border-r border-vibecaster-lavender/20">
              <p className="text-xl font-bold text-vibecaster-lavender">{totalChallenges?.toString() || '0'}</p>
              <p className="text-xs text-vibecaster-light-purple">Total Challenges</p>
            </div>
            <div className="px-4 py-3 text-center border-r border-vibecaster-lavender/20">
              <p className="text-xl font-bold text-vibecaster-lavender">{totalResponses?.toString() || '0'}</p>
              <p className="text-xs text-vibecaster-light-purple">Total Responses</p>
            </div>
            <div className="px-4 py-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
              <p className="text-xl font-bold text-vibecaster-lavender">{challenges.length}</p>
              <p className="text-xs text-vibecaster-light-purple">Active Chains</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-vibecaster-dark/30 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'create'
              ? 'bg-vibecaster-lavender text-vibecaster-dark'
              : 'text-vibecaster-light-purple hover:text-vibecaster-lavender'
          }`}
        >
          Create Challenge
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'challenges'
              ? 'bg-vibecaster-lavender text-vibecaster-dark'
              : 'text-vibecaster-light-purple hover:text-vibecaster-lavender'
          }`}
        >
          Challenges
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-vibecaster-lavender">Active Challenges</h3>
            {challenges.length === 0 ? (
              <p className="text-vibecaster-light-purple text-center py-8">No challenges yet. Create one to get started!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-4 border border-vibecaster-lavender/20">
                    {/* Challenge Image */}
                    {challenge.data.promptImageIpfsHash && (
                      <div className="relative mb-3">
                        <Image
                          src={`https://gateway.pinata.cloud/ipfs/${challenge.data.promptImageIpfsHash}`}
                          alt="Challenge"
                          width={300}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <FaBolt size={14} className="text-yellow-400" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Challenge Info */}
                    <h4 className="text-white font-semibold mb-2">{challenge.data.prompt}</h4>
                    <p className="text-xs text-vibecaster-light-purple mb-3">
                      by {challenge.data.initiator.slice(0, 6)}...{challenge.data.initiator.slice(-4)}
                    </p>
                    <p className="text-xs text-vibecaster-light-purple mb-3">
                      {formatTimeAgo(challenge.data.timestamp)}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-vibecaster-light-purple">
                        {getResponseCount(challenge.id)} responses
                      </span>
                    </div>

                    {/* Join Button */}
                    <button
                      onClick={() => {
                        setSelectedChallengeId(challenge.id);
                        setSelectedParentResponseId(null);
                      }}
                      className="w-full bg-vibecaster-lavender text-vibecaster-dark px-4 py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors"
                    >
                      Join Challenge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-vibecaster-lavender mb-4">Create a Challenge</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-vibecaster-light-purple mb-2">Challenge Prompt</label>
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="What's your viral challenge?"
                    className="w-full bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender resize-none"
                    rows={3}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-vibecaster-light-purple mb-2">Challenge Image (Optional)</label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative mb-4">
                      <Image
                        src={imagePreview}
                        alt="Selected image"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearForm}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  )}

                  {/* Upload Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCameraCapture}
                      className="flex-1 bg-vibecaster-lavender hover:bg-vibecaster-lavender/80 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCamera size={16} />
                      Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-vibecaster-purple-dark hover:bg-vibecaster-purple-dark/80 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaUpload size={16} />
                      Upload
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                <button
                  onClick={handleCreateChallenge}
                  disabled={isCreatingChallenge}
                  className="w-full bg-vibecaster-lavender text-vibecaster-dark py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors disabled:opacity-50"
                >
                  {isCreatingChallenge ? 'Creating...' : 'Create Challenge'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Join Challenge Modal */}
      {selectedChallengeId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-vibecaster-dark rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-vibecaster-lavender mb-4">Join Challenge</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-vibecaster-light-purple mb-2">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Your response to the challenge..."
                  className="w-full bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender resize-none"
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedChallengeId(null);
                    setResponseText('');
                  }}
                  className="flex-1 bg-vibecaster-purple-dark text-vibecaster-lavender py-2 rounded-md hover:bg-vibecaster-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinChallenge}
                  disabled={isJoiningChallenge}
                  className="flex-1 bg-vibecaster-lavender text-vibecaster-dark py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors disabled:opacity-50"
                >
                  {isJoiningChallenge ? 'Joining...' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
