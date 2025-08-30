"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { FaFire, FaSnowflake, FaBolt, FaSync, FaTrophy, FaMedal, FaCrown, FaStar } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import VibeCasterPointsArtifact from '../abis/VibeCasterPoints.json';
import VibeCasterBadgesArtifact from '../abis/VibeCasterBadges.json';
import RoastMeContractArtifact from '../abis/RoastMeContract.json';
import IcebreakerContractArtifact from '../abis/IcebreakerContract.json';
import ChainReactionContractArtifact from '../abis/ChainReactionContract.json';

const VibeCasterPointsABI = VibeCasterPointsArtifact.abi;
const VibeCasterBadgesABI = VibeCasterBadgesArtifact.abi;
const RoastMeContractABI = RoastMeContractArtifact.abi;
const IcebreakerContractABI = IcebreakerContractArtifact.abi;
const ChainReactionContractABI = ChainReactionContractArtifact.abi;

// Contract addresses
const VIBECASTER_POINTS_ADDRESS = "0xEe832dc966BC8D66742aA0c01bC7797116839634";
const VIBECASTER_BADGES_ADDRESS = "0x5820440e686A5519ca5Eb1c6148C54d77DE23115";
const ROAST_ME_CONTRACT_ADDRESS = "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0";
const ICEBREAKER_CONTRACT_ADDRESS = "0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B";
const CHAIN_REACTION_CONTRACT_ADDRESS = "0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9";

interface ActivityProps {
  setActiveTab: (tab: string) => void;
}

export default function Activity({ setActiveTab }: ActivityProps) {
  const { address, isConnected } = useAccount();
  const [activityFilter, setActivityFilter] = useState("all");
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userBadges, setUserBadges] = useState<number[]>([]);
  const [totalRoasts, setTotalRoasts] = useState<number>(0);
  const [totalChainReactions, setTotalChainReactions] = useState<number>(0);
  const [totalIcebreakers, setTotalIcebreakers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Contract read functions
  const { data: pointsData } = useReadContract({
    address: VIBECASTER_POINTS_ADDRESS,
    abi: VibeCasterPointsABI,
    functionName: "userPoints",
    args: address ? [address] : undefined,
  });

  const { data: totalRoastsData } = useReadContract({
    address: ROAST_ME_CONTRACT_ADDRESS,
    abi: RoastMeContractABI,
    functionName: "totalRoasts",
  });

  const { data: totalChainReactionsData } = useReadContract({
    address: CHAIN_REACTION_CONTRACT_ADDRESS,
    abi: ChainReactionContractABI,
    functionName: "totalChains",
  });

  const { data: totalIcebreakersData } = useReadContract({
    address: ICEBREAKER_CONTRACT_ADDRESS,
    abi: IcebreakerContractABI,
    functionName: "totalPrompts",
  });

  const { data: userBadgesData } = useReadContract({
    address: VIBECASTER_BADGES_ADDRESS,
    abi: VibeCasterBadgesABI,
    functionName: "getUserBadges",
    args: address ? [address] : undefined,
  });

  // Update data when contract data changes
  useEffect(() => {
    if (pointsData !== undefined) {
      setUserPoints(Number(pointsData));
    }
  }, [pointsData]);

  useEffect(() => {
    if (totalRoastsData !== undefined) {
      setTotalRoasts(Number(totalRoastsData));
    }
  }, [totalRoastsData]);

  useEffect(() => {
    if (totalChainReactionsData !== undefined) {
      setTotalChainReactions(Number(totalChainReactionsData));
    }
  }, [totalChainReactionsData]);

  useEffect(() => {
    if (totalIcebreakersData !== undefined) {
      setTotalIcebreakers(Number(totalIcebreakersData));
    }
  }, [totalIcebreakersData]);

  useEffect(() => {
    if (userBadgesData && Array.isArray(userBadgesData)) {
      setUserBadges(userBadgesData.map(badge => Number(badge)));
    }
  }, [userBadgesData]);

  // Calculate user level based on points
  const getUserLevel = (points: number) => {
    if (points >= 1000) return "Vibe Master";
    if (points >= 500) return "Vibe Legend";
    if (points >= 200) return "Vibe Pro";
    if (points >= 50) return "Vibe Enthusiast";
    return "Vibe Newbie";
  };

  const userLevel = getUserLevel(userPoints);

  // Dynamic recent activities based on user's actual activity
  const generateRecentActivities = () => {
    const activities = [];
    
    // Add roast activity if user has roasts
    if (totalRoasts > 0) {
      activities.push({
        type: "roast",
        title: `Submitted ${totalRoasts} roast${totalRoasts > 1 ? 's' : ''}`,
        points: `+${totalRoasts * 10}`,
        timestamp: "Recently"
      });
    }
    
    // Add chain reaction activity if user has chains
    if (totalChainReactions > 0) {
      activities.push({
        type: "chain",
        title: `Started ${totalChainReactions} chain reaction${totalChainReactions > 1 ? 's' : ''}`,
        points: `+${totalChainReactions * 20}`,
        timestamp: "Recently"
      });
    }
    
    // Add icebreaker activity if user has icebreakers
    if (totalIcebreakers > 0) {
      activities.push({
        type: "icebreaker",
        title: `Answered ${totalIcebreakers} icebreaker${totalIcebreakers > 1 ? 's' : ''}`,
        points: `+${totalIcebreakers * 5}`,
        timestamp: "Recently"
      });
    }
    
    // Add points earned activity
    if (userPoints > 0) {
      activities.push({
        type: "points",
        title: `Earned ${userPoints} total points`,
        points: `+${userPoints}`,
        timestamp: "Total"
      });
    }
    
    // If no activities, show default message
    if (activities.length === 0) {
      activities.push({
        type: "welcome",
        title: "Welcome to VibeCaster!",
        points: "Start earning",
        timestamp: "Now"
      });
    }
    
    return activities;
  };

  const recentActivities = generateRecentActivities();

  // Mock gallery data
  const roastGalleryItems = [
    { id: 1, title: "Epic Roast #1", image: "/sample.png", likes: 42, timestamp: "2h ago" },
    { id: 2, title: "Viral Moment", image: "/sample.png", likes: 89, timestamp: "2d ago" },
    { id: 3, title: "AI Comedy Gold", image: "/sample.png", likes: 156, timestamp: "3d ago" },
  ];

  const chainGalleryItems = [
    { id: 1, title: "Chain Challenge", image: "/sample.png", likes: 156, timestamp: "1d ago" },
    { id: 2, title: "Viral Trend", image: "/sample.png", likes: 234, timestamp: "2d ago" },
    { id: 3, title: "Community Challenge", image: "/sample.png", likes: 89, timestamp: "4d ago" },
  ];

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-vibecaster-lavender mb-2">Activity Dashboard</h2>
        <p className="text-sm md:text-base text-vibecaster-light-purple">Track your VibeCaster journey and achievements</p>
      </div>

      {/* Main Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Points Card */}
        <div className="lg:col-span-1">
          <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-vibecaster-lavender/20">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white">On-chain Points</h2>
              <button className="text-vibecaster-lavender hover:text-vibecaster-light-purple transition-colors">
                <FaSync size={14} className="md:w-4 md:h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-vibecaster-lavender">{userPoints}</div>
                <div className="text-xs md:text-sm text-vibecaster-light-purple">Total Points</div>
              </div>
              <div className="text-right">
                <div className="text-base md:text-lg font-bold text-vibecaster-light-purple">{userLevel}</div>
                <div className="text-xs md:text-sm text-vibecaster-light-purple">Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-vibecaster-lavender/20">
            {/* Quick Stats - Inside the Recent Activity container, above the header */}
            <div className="bg-vibecaster-dark/50 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 mb-4 md:mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="p-2 md:p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-lg md:text-xl font-bold text-vibecaster-lavender">{totalRoasts}</div>
                  <div className="text-xs text-vibecaster-light-purple">Total Roasts</div>
                </div>
                <div className="p-2 md:p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-lg md:text-xl font-bold text-vibecaster-lavender">{totalChainReactions}</div>
                  <div className="text-xs text-vibecaster-light-purple">Chain Reactions</div>
                </div>
                <div className="p-2 md:p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-lg md:text-xl font-bold text-vibecaster-lavender">{totalIcebreakers}</div>
                  <div className="text-xs text-vibecaster-light-purple">Icebreakers</div>
                </div>
                <div className="p-2 md:p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-lg md:text-xl font-bold text-vibecaster-lavender">{userBadges.length}</div>
                  <div className="text-xs text-vibecaster-light-purple">Badges Earned</div>
                </div>
              </div>
            </div>

            <div className="mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">Recent Activity</h2>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className="text-vibecaster-lavender hover:text-vibecaster-light-purple transition-colors text-xs md:text-sm"
              >
                View Leaderboard
              </button>
            </div>

            {/* Activity Filters */}
            <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
              <button
                onClick={() => setActivityFilter("all")}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-colors ${
                  activityFilter === "all"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
                    : "text-white hover:bg-vibecaster-lavender/20"
                }`}
              >
                All ({recentActivities.length})
              </button>
              <button
                onClick={() => setActivityFilter("roast")}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-colors ${
                  activityFilter === "roast"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
                    : "text-white hover:bg-vibecaster-lavender/20"
                }`}
              >
                Roasts
              </button>
              <button
                onClick={() => setActivityFilter("chain")}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-colors ${
                  activityFilter === "chain"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
                    : "text-white hover:bg-vibecaster-lavender/20"
                }`}
              >
                Chains
              </button>
              <button
                onClick={() => setActivityFilter("points")}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-colors ${
                  activityFilter === "points"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
                    : "text-white hover:bg-vibecaster-lavender/20"
                }`}
              >
                Points
              </button>
            </div>

            {/* Activity List */}
            <div className="space-y-2 md:space-y-3">
              {recentActivities
                .filter(activity => activityFilter === "all" || activity.type === activityFilter)
                .map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-vibecaster-dark/50 border border-vibecaster-lavender/20">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-vibecaster-lavender/20 flex items-center justify-center">
                        {activity.type === "roast" && <FaFire size={12} className="md:w-3.5 md:h-3.5 text-red-400" />}
                        {activity.type === "icebreaker" && <FaSnowflake size={12} className="md:w-3.5 md:h-3.5 text-blue-400" />}
                        {activity.type === "chain" && <FaBolt size={12} className="md:w-3.5 md:h-3.5 text-yellow-400" />}
                        {activity.type === "points" && <FaTrophy size={12} className="md:w-3.5 md:h-3.5 text-yellow-400" />}
                        {activity.type === "welcome" && <HiSparkles size={12} className="md:w-3.5 md:h-3.5 text-vibecaster-lavender" />}
                      </div>
                      <div>
                        <div className="text-sm md:text-base text-white font-medium">{activity.title}</div>
                        <div className="text-xs text-vibecaster-light-purple">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-sm md:text-base text-vibecaster-lavender font-bold">{activity.points}</div>
                  </div>
                ))}
            </div>

            {/* Roast Gallery - Show only when roast filter is active */}
            {activityFilter === "roast" && (
              <div className="mt-4 md:mt-6">
                <h4 className="text-base md:text-lg font-semibold text-vibecaster-lavender mb-3 md:mb-4">Recent Roasts</h4>
                <div className="space-y-2 md:space-y-3">
                  {roastGalleryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-vibecaster-dark/50 border border-vibecaster-lavender/20">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-vibecaster-lavender/20 flex items-center justify-center">
                        <FaFire size={16} className="md:w-5 md:h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm md:text-base text-white font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2 md:gap-4 text-xs text-vibecaster-light-purple">
                          <span>{item.likes} likes</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chain Gallery - Show only when chain filter is active */}
            {activityFilter === "chain" && (
              <div className="mt-4 md:mt-6">
                <h4 className="text-base md:text-lg font-semibold text-vibecaster-lavender mb-3 md:mb-4">Chain Reactions</h4>
                <div className="space-y-2 md:space-y-3">
                  {chainGalleryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-vibecaster-dark/50 border border-vibecaster-lavender/20">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-vibecaster-lavender/20 flex items-center justify-center">
                        <FaBolt size={16} className="md:w-5 md:h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm md:text-base text-white font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2 md:gap-4 text-xs text-vibecaster-light-purple">
                          <span>{item.likes} likes</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mt-6 md:mt-8">
        <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-vibecaster-lavender/20">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white">Your Badges</h2>
            <div className="text-xs md:text-sm text-vibecaster-light-purple">
              {userBadges.length} of 6 badges earned
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {/* First Activity Badge */}
            <div className={`text-center p-3 md:p-4 rounded-lg border transition-all ${
              userBadges.length > 0 
                ? 'bg-vibecaster-lavender/20 border-vibecaster-lavender text-white' 
                : 'bg-vibecaster-dark/50 border-vibecaster-lavender/20 text-vibecaster-lavender/50'
            }`}>
              <FaStar size={20} className="mx-auto mb-1 md:mb-2 md:w-6 md:h-6" />
              <div className="text-xs font-medium">First Activity</div>
              <div className="text-xs text-vibecaster-light-purple">Complete 1 activity</div>
            </div>

            {/* Login Streak Badge */}
            <div className={`text-center p-3 md:p-4 rounded-lg border transition-all ${
              userBadges.length > 1 
                ? 'bg-vibecaster-lavender/20 border-vibecaster-lavender text-white' 
                : 'bg-vibecaster-dark/50 border-vibecaster-lavender/20 text-vibecaster-lavender/50'
            }`}>
              <FaCrown size={20} className="mx-auto mb-1 md:mb-2 md:w-6 md:h-6" />
              <div className="text-xs font-medium">Login Streak</div>
              <div className="text-xs text-vibecaster-light-purple">7 day streak</div>
            </div>

            {/* Activity Streak Badge */}
            <div className={`text-center p-3 md:p-4 rounded-lg border transition-all ${
              userBadges.length > 2 
                ? 'bg-vibecaster-lavender/20 border-vibecaster-lavender text-white' 
                : 'bg-vibecaster-dark/50 border-vibecaster-lavender/20 text-vibecaster-lavender/50'
            }`}>
              <FaMedal size={20} className="mx-auto mb-1 md:mb-2 md:w-6 md:h-6" />
              <div className="text-xs font-medium">Activity Streak</div>
              <div className="text-xs text-vibecaster-light-purple">5 day activity</div>
            </div>

            {/* Top Roaster Badge */}
            <div className={`text-center p-3 md:p-4 rounded-lg border transition-all ${
              userBadges.length > 3 
                ? 'bg-vibecaster-lavender/20 border-vibecaster-lavender text-white' 
                : 'bg-vibecaster-dark/50 border-vibecaster-lavender/20 text-vibecaster-lavender/50'
            }`}>
              <FaFire size={20} className="mx-auto mb-1 md:mb-2 md:w-6 md:h-6" />
              <div className="text-xs font-medium">Top Roaster</div>
              <div className="text-xs text-vibecaster-light-purple">10 roasts</div>
            </div>

            {/* Chain Master Badge */}
            <div className={`text-center p-3 md:p-4 rounded-lg border transition-all ${
              userBadges.length > 4 
                ? 'bg-vibecaster-lavender/20 border-vibecaster-lavender text-white' 
                : 'bg-vibecaster-dark/50 border-vibecaster-lavender/20 text-vibecaster-lavender/50'
            }`}>
              <FaBolt size={20} className="mx-auto mb-1 md:mb-2 md:w-6 md:h-6" />
              <div className="text-xs font-medium">Chain Master</div>
              <div className="text-xs text-vibecaster-light-purple">5 chains</div>
            </div>

            {/* Icebreaker Badge */}
            <div className={`text-center p-3 md:p-4 rounded-lg border transition-all ${
              userBadges.length > 5 
                ? 'bg-vibecaster-lavender/20 border-vibecaster-lavender text-white' 
                : 'bg-vibecaster-dark/50 border-vibecaster-lavender/20 text-vibecaster-lavender/50'
            }`}>
              <FaSnowflake size={20} className="mx-auto mb-1 md:mb-2 md:w-6 md:h-6" />
              <div className="text-xs font-medium">Icebreaker</div>
              <div className="text-xs text-vibecaster-light-purple">10 responses</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
