"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import RoastMe from './RoastMe';
import Leaderboard from './Leaderboard';
import RoastGallery from './RoastGallery';
import ChainReactionGallery from './ChainReactionGallery';
import Icebreaker from './Icebreaker';
import Activity from './Activity';

export default function VibeCasterDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('activity');
  const [currentEmoji, setCurrentEmoji] = useState('🚀');

  // Rotate emojis every 5 seconds
  useEffect(() => {
    const emojis = ['🚀', '💎', '🔥', '⚡', '🎯', '✨', '🌟', '💫'];
    const interval = setInterval(() => {
      setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">{currentEmoji}</div>
        <h2 className="text-2xl font-bold text-vibecaster-lavender mb-4">Welcome to VibeCaster</h2>
        <p className="text-vibecaster-light-purple">Connect your wallet to start vibing!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <div className="text-center py-12 px-4">
        <div className="text-4xl mb-4 animate-bounce">{currentEmoji}</div>
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-vibecaster-lavender">GM VibeCaster fam!</span> 🚀
        </h1>
        <p className="text-xl text-vibecaster-light-purple mb-6">
          Another day to roast, create & vibe! Let's make some magic happen
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <span className="bg-vibecaster-lavender/20 text-vibecaster-lavender px-3 py-1 rounded-full">
            Roast
          </span>
          <span className="bg-vibecaster-lavender/20 text-vibecaster-lavender px-3 py-1 rounded-full">
            Create
          </span>
          <span className="bg-vibecaster-lavender/20 text-vibecaster-lavender px-3 py-1 rounded-full">
            Connect
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-1 border border-vibecaster-lavender/20">
          {[
            { id: 'activity', label: 'Activity' },
            { id: 'leaderboard', label: 'Leaderboard' },
            { id: 'roastme', label: 'Roast Me' },
            { id: 'icebreaker', label: 'Icebreaker' },
            { id: 'chainreaction', label: 'Chain Reaction' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-md transition-colors font-medium ${
                activeTab === tab.id
                  ? 'bg-vibecaster-lavender text-vibecaster-dark'
                  : 'text-vibecaster-light-purple hover:text-vibecaster-lavender'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === 'activity' && (
          <div className="max-w-6xl mx-auto">
            <Activity />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-6">
              <Leaderboard />
            </div>
          </div>
        )}

        {activeTab === 'roastme' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-6">
              <RoastMe />
            </div>
          </div>
        )}

        {activeTab === 'icebreaker' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-6">
              <Icebreaker />
            </div>
          </div>
        )}

        {activeTab === 'chainreaction' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-6">
              <ChainReactionGallery />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
