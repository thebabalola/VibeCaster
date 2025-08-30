"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { FaFire, FaSnowflake, FaBolt, FaTrophy, FaCrown, FaSync, FaImages } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// VibeCaster contract addresses (to be updated with actual deployed addresses)
const VIBECASTER_POINTS_ADDRESS = "0xEe832dc966BC8D66742aA0c01bC7797116839634";
const VIBECASTER_BADGES_ADDRESS = "0x5820440e686A5519ca5Eb1c6148C54d77DE23115";

export default function VibeCasterDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("activity");
  const [activityFilter, setActivityFilter] = useState("all");

  // Mock data for now - will be replaced with actual contract calls
  const userPoints = 156;
  const userLevel = "Vibe Master";
  const recentActivities = [
    { type: "roast", title: "Got roasted by AI", points: "+10", timestamp: "2h ago" },
    { type: "icebreaker", title: "Answered icebreaker", points: "+5", timestamp: "4h ago" },
    { type: "chain", title: "Started viral chain", points: "+20", timestamp: "1d ago" },
  ];

  // Mock gallery data
  const galleryItems = [
    { id: 1, title: "Epic Roast #1", type: "roast", image: "/sample.png", likes: 42, timestamp: "2h ago" },
    { id: 2, title: "Icebreaker Response", type: "icebreaker", image: "/sample.png", likes: 28, timestamp: "4h ago" },
    { id: 3, title: "Chain Challenge", type: "chain", image: "/sample.png", likes: 156, timestamp: "1d ago" },
    { id: 4, title: "Viral Moment", type: "roast", image: "/sample.png", likes: 89, timestamp: "2d ago" },
  ];

  const tabs = [
    { id: "activity", label: "Activity", icon: HiSparkles },
    { id: "gallery", label: "Gallery", icon: FaImages },
    { id: "leaderboard", label: "Leaderboard", icon: FaTrophy },
    { id: "roast", label: "Roast Me", icon: FaFire },
    { id: "icebreaker", label: "Icebreaker", icon: FaSnowflake },
    { id: "chain", label: "Chain Reaction", icon: FaBolt },
    { id: "admin", label: "Admin", icon: FaCrown },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "admin" && !isConnected) {
      alert("Please connect your wallet to access admin features");
      return;
    }
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "activity":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Points Card */}
            <div className="lg:col-span-1">
              <div className="vibecaster-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">On-chain Points</h2>
                  <button className="text-vibecaster-lavender hover:text-vibecaster-pink-light transition-colors">
                    <FaSync size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-vibecaster-lavender">{userPoints}</div>
                    <div className="text-sm text-vibecaster-pink-light">Total Points</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-vibecaster-pink-light">{userLevel}</div>
                    <div className="text-sm text-vibecaster-pink-light">Level</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="vibecaster-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                  <button className="text-vibecaster-lavender hover:text-vibecaster-pink-light transition-colors text-sm">
                    View Leaderboard
                  </button>
                </div>

                {/* Activity Filters */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActivityFilter("all")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      activityFilter === "all"
                        ? "bg-vibecaster-lavender text-white"
                        : "text-white hover:bg-vibecaster-lavender/20"
                    }`}
                  >
                    All ({recentActivities.length})
                  </button>
                  <button
                    onClick={() => setActivityFilter("roast")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      activityFilter === "roast"
                        ? "bg-vibecaster-lavender text-white"
                        : "text-white hover:bg-vibecaster-lavender/20"
                    }`}
                  >
                    Roasts
                  </button>
                  <button
                    onClick={() => setActivityFilter("chain")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      activityFilter === "chain"
                        ? "bg-vibecaster-lavender text-white"
                        : "text-white hover:bg-vibecaster-lavender/20"
                    }`}
                  >
                    Chains
                  </button>
                </div>

                {/* Activity List */}
                <div className="space-y-3">
                  {recentActivities
                    .filter(activity => activityFilter === "all" || activity.type === activityFilter)
                    .map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-vibecaster-lavender/20 flex items-center justify-center">
                            {activity.type === "roast" && <FaFire size={14} className="text-red-400" />}
                            {activity.type === "icebreaker" && <FaSnowflake size={14} className="text-blue-400" />}
                            {activity.type === "chain" && <FaBolt size={14} className="text-yellow-400" />}
                          </div>
                          <div>
                            <div className="text-white font-medium">{activity.title}</div>
                            <div className="text-xs text-vibecaster-pink-light">{activity.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-vibecaster-lavender font-bold">{activity.points}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="vibecaster-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Community Gallery</h2>
              <button className="bg-vibecaster-lavender hover:bg-vibecaster-pink-light text-white px-4 py-2 rounded-lg transition-colors">
                Upload Content
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-vibecaster-purple-dark/20 rounded-lg overflow-hidden border border-vibecaster-lavender/20">
                  <div className="aspect-square bg-vibecaster-purple-dark relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 rounded-full bg-vibecaster-lavender/20 flex items-center justify-center">
                        {item.type === "roast" && <FaFire size={14} className="text-red-400" />}
                        {item.type === "icebreaker" && <FaSnowflake size={14} className="text-blue-400" />}
                        {item.type === "chain" && <FaBolt size={14} className="text-yellow-400" />}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-vibecaster-pink-light">{item.likes} likes</span>
                      <span className="text-vibecaster-pink-light">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "leaderboard":
        return (
          <div className="vibecaster-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>
            <p className="text-vibecaster-pink-light">Leaderboard content coming soon...</p>
          </div>
        );

      case "roast":
        return (
          <div className="vibecaster-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Roast Me</h2>
            <p className="text-vibecaster-pink-light">Roast Me feature coming soon...</p>
          </div>
        );

      case "icebreaker":
        return (
          <div className="vibecaster-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Icebreaker</h2>
            <p className="text-vibecaster-pink-light">Icebreaker feature coming soon...</p>
          </div>
        );

      case "chain":
        return (
          <div className="vibecaster-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Chain Reaction</h2>
            <p className="text-vibecaster-pink-light">Chain Reaction feature coming soon...</p>
          </div>
        );

      case "admin":
        return (
          <div className="vibecaster-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Panel</h2>
            <p className="text-vibecaster-pink-light">Admin features coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen vibecaster-bg">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to <span className="text-vibecaster-lavender">VibeCaster</span>
            </h1>
            <p className="text-vibecaster-pink-light">
              The Future of Social on Farcaster
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isAdmin = tab.id === "admin";
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-vibecaster-lavender text-white"
                    : "text-white hover:bg-vibecaster-lavender/20"
                } ${isAdmin ? "border border-vibecaster-pink-light" : ""}`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        {renderContent()}

        {/* Feature Cards - Only show on Activity tab */}
        {activeTab === "activity" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="vibecaster-card p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFire size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Roast Me</h3>
              <p className="text-sm text-vibecaster-pink-light mb-4">
                Submit your selfie and get roasted by AI
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                Get Roasted
              </button>
            </div>

            <div className="vibecaster-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSnowflake size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Icebreaker</h3>
              <p className="text-sm text-vibecaster-pink-light mb-4">
                Answer quirky prompts and break the ice
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Break Ice
              </button>
            </div>

            <div className="vibecaster-card p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBolt size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chain Reaction</h3>
              <p className="text-sm text-vibecaster-pink-light mb-4">
                Start viral challenges and watch them grow
              </p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
                Start Chain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
