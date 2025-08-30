"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { FaChartLine, FaTrophy, FaFire, FaSnowflake, FaBolt } from 'react-icons/fa';
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
      <div className="text-center py-12 md:py-20 px-4">
        <div className="text-4xl md:text-6xl mb-4">{currentEmoji}</div>
        <h2 className="text-xl md:text-2xl font-bold text-vibecaster-lavender mb-4">Welcome to VibeCaster</h2>
        <p className="text-sm md:text-base text-vibecaster-light-purple">Connect your wallet to start vibing!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Welcome Section */}
      <div className="text-center py-8 md:py-14 px-4 mt-4 md:mt-6 mb-6 md:mb-10">
        <div className="text-3xl md:text-4xl mb-4 animate-bounce">{currentEmoji}</div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          <span className="text-white">Gm </span>
          <span style={{ color: '#5F4091' }}>Vi</span>
          <span style={{ color: '#D14C77' }}>be</span>
          <span className="text-white">Caster's</span>
          {/* <span className="text-white"> fam!</span> */}
        </h1>
        <p className="text-base md:text-xl text-vibecaster-light-purple mb-4 md:mb-6">
          Another day to roast, create & vibe! Let's make some magic happen
        </p>
        <div className="flex justify-center space-x-2 md:space-x-4 text-xs md:text-sm">
          <span className="bg-vibecaster-lavender/20 text-vibecaster-lavender px-2 md:px-3 py-1 rounded-full">
            Roast
          </span>
          <span className="bg-vibecaster-lavender/20 text-vibecaster-lavender px-2 md:px-3 py-1 rounded-full">
            Create
          </span>
          <span className="bg-vibecaster-lavender/20 text-vibecaster-lavender px-2 md:px-3 py-1 rounded-full">
            Connect
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6 md:mb-8 px-2">
        <div className="flex flex-wrap justify-center space-x-1 bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-1 border border-vibecaster-lavender/20">
          {[
            { 
              id: 'activity', 
              label: 'Activity', 
              icon: FaChartLine 
            },
            { 
              id: 'roastme', 
              label: 'Roast Me', 
              icon: FaFire 
            },
            { 
              id: 'icebreaker', 
              label: 'Icebreaker', 
              icon: FaSnowflake 
            },
            { 
              id: 'chainreaction', 
              label: 'Chain Reaction', 
              icon: FaBolt 
            },
            { 
              id: 'leaderboard', 
              label: 'Leaderboard', 
              icon: FaTrophy 
            },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-md transition-colors font-medium text-xs md:text-sm relative group ${
                  activeTab === tab.id
                    ? 'bg-vibecaster-lavender text-vibecaster-dark'
                    : 'text-vibecaster-light-purple hover:text-vibecaster-lavender'
                }`}
                title={tab.label}
              >
                {/* Mobile: Show icon only */}
                <div className="md:hidden">
                  <IconComponent className="text-lg" />
                </div>
                
                {/* Desktop: Show text */}
                <div className="hidden md:block">
                  {tab.label}
                </div>
                
                {/* Mobile tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-vibecaster-dark text-vibecaster-lavender text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap md:hidden">
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-2 md:px-4 pb-6 md:pb-8 overflow-x-hidden">
        {activeTab === 'activity' && (
          <div className="max-w-6xl mx-auto">
            <Activity setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-4 md:p-6">
              <Leaderboard />
            </div>
          </div>
        )}

        {activeTab === 'roastme' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-4 md:p-6">
              <RoastMe />
            </div>
          </div>
        )}

        {activeTab === 'icebreaker' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-4 md:p-6">
              <Icebreaker />
            </div>
          </div>
        )}

        {activeTab === 'chainreaction' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 p-4 md:p-6">
              <ChainReactionGallery />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
