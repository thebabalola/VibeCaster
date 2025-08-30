"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { FaSnowflake } from 'react-icons/fa';
import IcebreakerContractArtifact from '@/abis/IcebreakerContract.json';

// Contract address from deployment
const ICEBREAKER_CONTRACT_ADDRESS = "0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10";

interface Category {
  name: string;
  description: string;
  exists: boolean;
}

interface Prompt {
  creator: string;
  text: string;
  category: string;
  timestamp: bigint;
  exists: boolean;
}

interface Response {
  responder: string;
  responseText: string;
  responseImageIpfsHash: string;
  timestamp: bigint;
  exists: boolean;
}

interface Poll {
  creator: string;
  question: string;
  options: string[];
  voteCounts: bigint[];
  totalVotes: bigint;
}

export default function Icebreaker() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'prompts' | 'polls' | 'create'>('prompts');
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [promptText, setPromptText] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [responseText, setResponseText] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Read contract data
  const { data: totalCategories } = useReadContract({
    address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
    abi: IcebreakerContractArtifact.abi,
    functionName: 'totalCategories',
  });

  const { data: totalPrompts } = useReadContract({
    address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
    abi: IcebreakerContractArtifact.abi,
    functionName: 'totalPrompts',
  });

  const { data: totalPolls } = useReadContract({
    address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
    abi: IcebreakerContractArtifact.abi,
    functionName: 'totalPolls',
  });

  // Write contract functions
  const { writeContract: createPrompt, data: createPromptHash } = useWriteContract();
  const { writeContract: createPoll, data: createPollHash } = useWriteContract();
  const { writeContract: submitResponse, data: submitResponseHash } = useWriteContract();
  const { writeContract: votePoll, data: votePollHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isCreatingPrompt } = useWaitForTransactionReceipt({ hash: createPromptHash });
  const { isLoading: isCreatingPoll } = useWaitForTransactionReceipt({ hash: createPollHash });
  const { isLoading: isSubmittingResponse } = useWaitForTransactionReceipt({ hash: submitResponseHash });
  const { isLoading: isVoting } = useWaitForTransactionReceipt({ hash: votePollHash });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      if (totalCategories && typeof totalCategories === 'bigint' && totalCategories > 0n) {
        try {
          const categoriesData = await fetch(`/api/icebreaker/categories?total=${totalCategories.toString()}`);
          const categoriesList = await categoriesData.json();
          setCategories(categoriesList);
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
    };
    loadCategories();
  }, [totalCategories]);

  // Load prompts
  useEffect(() => {
    const loadPrompts = async () => {
      if (totalPrompts && typeof totalPrompts === 'bigint' && totalPrompts > 0n) {
        try {
          const promptsData = await fetch(`/api/icebreaker/prompts?total=${totalPrompts.toString()}`);
          const promptsList = await promptsData.json();
          setPrompts(promptsList);
        } catch (error) {
          console.error('Error loading prompts:', error);
        }
      }
    };
    loadPrompts();
  }, [totalPrompts]);

  // Load polls
  useEffect(() => {
    const loadPolls = async () => {
      if (totalPolls && typeof totalPolls === 'bigint' && totalPolls > 0n) {
        try {
          const pollsData = await fetch(`/api/icebreaker/polls?total=${totalPolls.toString()}`);
          const pollsList = await pollsData.json();
          setPolls(pollsList);
        } catch (error) {
          console.error('Error loading polls:', error);
        }
      }
    };
    loadPolls();
  }, [totalPolls]);

  const handleCreatePrompt = async () => {
    if (!promptText.trim() || !selectedCategory) {
      alert('Please fill in all fields');
      return;
    }

    try {
      createPrompt({
        address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
        abi: IcebreakerContractArtifact.abi,
        functionName: 'createPrompt',
        args: [promptText, selectedCategory],
      });
    } catch (error) {
      console.error('Error creating prompt:', error);
    }
  };

  const handleCreatePoll = async () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    try {
      createPoll({
        address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
        abi: IcebreakerContractArtifact.abi,
        functionName: 'createPoll',
        args: [pollQuestion, pollOptions],
      });
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || selectedPromptId === null) {
      alert('Please fill in response text');
      return;
    }

    try {
      submitResponse({
        address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
        abi: IcebreakerContractArtifact.abi,
        functionName: 'submitResponse',
        args: [BigInt(selectedPromptId), responseText, ''],
      });
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleVotePoll = async () => {
    if (selectedPollId === null || selectedOption === null) {
      alert('Please select an option');
      return;
    }

    try {
      votePoll({
        address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
        abi: IcebreakerContractArtifact.abi,
        functionName: 'votePoll',
        args: [BigInt(selectedPollId), BigInt(selectedOption)],
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-vibecaster-lavender">Please connect your wallet to use Icebreaker</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-vibecaster-lavender mb-2 flex items-center justify-center gap-2">
          <FaSnowflake className="text-blue-400" /> Icebreaker
        </h2>
        <p className="text-vibecaster-light-purple">Break the ice with fun prompts and polls!</p>
      </div>

      {/* Stats */}
      <div className="flex justify-center">
        <div className="bg-vibecaster-dark/50 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20">
          <div className="flex">
            <div className="px-4 py-3 text-center border-r border-vibecaster-lavender/20">
              <p className="text-xl font-bold text-vibecaster-lavender">{totalCategories?.toString() || '0'}</p>
              <p className="text-xs text-vibecaster-light-purple">Categories</p>
            </div>
            <div className="px-4 py-3 text-center border-r border-vibecaster-lavender/20">
              <p className="text-xl font-bold text-vibecaster-lavender">{totalPrompts?.toString() || '0'}</p>
              <p className="text-xs text-vibecaster-light-purple">Prompts</p>
            </div>
            <div className="px-4 py-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
              <p className="text-xl font-bold text-vibecaster-lavender">{totalPolls?.toString() || '0'}</p>
              <p className="text-xs text-vibecaster-light-purple">Polls</p>
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
          Create
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'prompts'
              ? 'bg-vibecaster-lavender text-vibecaster-dark'
              : 'text-vibecaster-light-purple hover:text-vibecaster-lavender'
          }`}
        >
          Prompts
        </button>
        <button
          onClick={() => setActiveTab('polls')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'polls'
              ? 'bg-vibecaster-lavender text-vibecaster-dark'
              : 'text-vibecaster-light-purple hover:text-vibecaster-lavender'
          }`}
        >
          Polls
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-vibecaster-lavender">Recent Prompts</h3>
            {prompts.length === 0 ? (
              <p className="text-vibecaster-light-purple text-center py-8">No prompts yet. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {prompts.slice(0, 5).map((prompt, index) => (
                  <div key={index} className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-vibecaster-lavender font-medium">{prompt.text}</h4>
                      <span className="text-xs text-vibecaster-light-purple bg-vibecaster-purple-dark px-2 py-1 rounded">
                        {prompt.category}
                      </span>
                    </div>
                    <p className="text-sm text-vibecaster-light-purple mb-3">
                      by {prompt.creator.slice(0, 6)}...{prompt.creator.slice(-4)}
                    </p>
                    <button
                      onClick={() => setSelectedPromptId(index + 1)}
                      className="bg-vibecaster-lavender text-vibecaster-dark px-4 py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors"
                    >
                      Respond
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === 'polls' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-vibecaster-lavender">Active Polls</h3>
            {polls.length === 0 ? (
              <p className="text-vibecaster-light-purple text-center py-8">No polls yet. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {polls.slice(0, 5).map((poll, index) => (
                  <div key={index} className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="text-vibecaster-lavender font-medium mb-3">{poll.question}</h4>
                    <div className="space-y-2 mb-3">
                      {poll.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => {
                            setSelectedPollId(index + 1);
                            setSelectedOption(optionIndex);
                          }}
                          className="w-full text-left p-2 rounded bg-vibecaster-dark/50 hover:bg-vibecaster-lavender hover:text-vibecaster-dark transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-vibecaster-light-purple">
                      Total votes: {poll.totalVotes.toString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Prompt */}
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-vibecaster-lavender mb-4">Create a Prompt</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-vibecaster-light-purple mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-vibecaster-light-purple mb-2">Prompt Text</label>
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="What's your icebreaker question?"
                    className="w-full bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender resize-none"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleCreatePrompt}
                  disabled={isCreatingPrompt}
                  className="w-full bg-vibecaster-lavender text-vibecaster-dark py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors disabled:opacity-50"
                >
                  {isCreatingPrompt ? 'Creating...' : 'Create Prompt'}
                </button>
              </div>
            </div>

            {/* Create Poll */}
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-vibecaster-lavender mb-4">Create a Poll</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-vibecaster-light-purple mb-2">Question</label>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="What's your poll question?"
                    className="w-full bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender"
                  />
                </div>
                <div>
                  <label className="block text-vibecaster-light-purple mb-2">Options</label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          onClick={() => removePollOption(index)}
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addPollOption}
                    className="text-vibecaster-lavender hover:text-vibecaster-light-purple transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                <button
                  onClick={handleCreatePoll}
                  disabled={isCreatingPoll}
                  className="w-full bg-vibecaster-lavender text-vibecaster-dark py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors disabled:opacity-50"
                >
                  {isCreatingPoll ? 'Creating...' : 'Create Poll'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedPromptId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-vibecaster-dark rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-vibecaster-lavender mb-4">Respond to Prompt</h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Your response..."
              className="w-full bg-vibecaster-dark/50 border border-vibecaster-lavender/20 rounded-md px-3 py-2 text-vibecaster-lavender focus:outline-none focus:border-vibecaster-lavender resize-none mb-4"
              rows={4}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedPromptId(null);
                  setResponseText('');
                }}
                className="flex-1 bg-vibecaster-purple-dark text-vibecaster-lavender py-2 rounded-md hover:bg-vibecaster-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={isSubmittingResponse}
                className="flex-1 bg-vibecaster-lavender text-vibecaster-dark py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors disabled:opacity-50"
              >
                {isSubmittingResponse ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Modal */}
      {selectedPollId !== null && selectedOption !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-vibecaster-dark rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-vibecaster-lavender mb-4">Confirm Vote</h3>
            <p className="text-vibecaster-light-purple mb-4">
              Are you sure you want to vote for "{polls[selectedPollId - 1]?.options[selectedOption]}"?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedPollId(null);
                  setSelectedOption(null);
                }}
                className="flex-1 bg-vibecaster-purple-dark text-vibecaster-lavender py-2 rounded-md hover:bg-vibecaster-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVotePoll}
                disabled={isVoting}
                className="flex-1 bg-vibecaster-lavender text-vibecaster-dark py-2 rounded-md hover:bg-vibecaster-light-purple transition-colors disabled:opacity-50"
              >
                {isVoting ? 'Voting...' : 'Vote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
