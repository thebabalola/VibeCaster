"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { FaFire, FaSnowflake, FaBolt, FaTrophy, FaSync, FaImages, FaCrown, FaStar, FaRocket, FaHeart, FaGem, FaMagic } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// VibeCaster contract addresses (to be updated with actual deployed addresses)
const VIBECASTER_POINTS_ADDRESS = "0xEe832dc966BC8D66742aA0c01bC7797116839634";
const VIBECASTER_BADGES_ADDRESS = "0x5820440e686A5519ca5Eb1c6148C54d77DE23115";

export default function VibeCasterDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("activity");
  const [activityFilter, setActivityFilter] = useState("all");
  const [currentIcon, setCurrentIcon] = useState("🔥");
  const [isAnimating, setIsAnimating] = useState(false);

  // Animated icons for the welcome section - updated to match VibeCaster theme
  const animatedIcons = ["🔥", "💎", "🎭", "🎨", "🎯", "🌟", "🎪", "✨"];
  const animatedIconComponents = [
    { icon: FaFire, color: "text-red-400" },
    { icon: FaBolt, color: "text-yellow-400" },
    { icon: FaGem, color: "text-purple-400" },
    { icon: FaRocket, color: "text-blue-400" },
    { icon: FaStar, color: "text-yellow-300" },
    { icon: FaCrown, color: "text-yellow-500" },
    { icon: FaMagic, color: "text-pink-400" },
    { icon: FaHeart, color: "text-red-500" },
    { icon: HiSparkles, color: "text-yellow-300" },
    { icon: FaTrophy, color: "text-yellow-400" },
  ];

  // Animation effect for icons
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * animatedIcons.length);
        setCurrentIcon(animatedIcons[randomIndex]);
        setIsAnimating(false);
      }, 300);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock data for now - will be replaced with actual contract calls
  const userPoints = 156;
  const userLevel = "Vibe Master";
  const recentActivities = [
    { type: "roast", title: "Got roasted by AI", points: "+10", timestamp: "2h ago" },
    { type: "icebreaker", title: "Answered icebreaker", points: "+5", timestamp: "4h ago" },
    { type: "chain", title: "Started viral chain", points: "+20", timestamp: "1d ago" },
  ];

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

  const tabs = [
    { id: "activity", label: "Activity", icon: HiSparkles },
    { id: "leaderboard", label: "Leaderboard", icon: FaTrophy },
    { id: "roast", label: "Roast Me", icon: FaFire },
    { id: "icebreaker", label: "Icebreaker", icon: FaSnowflake },
    { id: "chain", label: "Chain Reaction", icon: FaBolt },
  ];

  const handleTabClick = (tabId: string) => {
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

      case "leaderboard":
        return (
          <div className="vibecaster-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>
            <p className="text-vibecaster-pink-light">Leaderboard content coming soon...</p>
          </div>
        );

      case "roast":
        return (
          <div className="space-y-6">
            {/* Roast Me Feature */}
            <div className="vibecaster-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Roast Me</h2>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Get Roasted
                </button>
              </div>
              <p className="text-vibecaster-pink-light mb-6">
                Submit your selfie and get roasted by AI. Share the funniest roasts with the community!
              </p>
            </div>

            {/* Roast Gallery */}
            <div className="vibecaster-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaImages size={20} />
                  Roast Gallery
                </h3>
                <button className="text-vibecaster-lavender hover:text-vibecaster-pink-light transition-colors">
                  View All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roastGalleryItems.map((item) => (
                  <div key={item.id} className="bg-vibecaster-purple-dark/20 rounded-lg overflow-hidden border border-vibecaster-lavender/20">
                    <div className="aspect-square bg-vibecaster-purple-dark relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <FaFire size={14} className="text-red-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium mb-2">{item.title}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vibecaster-pink-light">{item.likes} likes</span>
                        <span className="text-vibecaster-pink-light">{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <div className="space-y-6">
            {/* Chain Reaction Feature */}
            <div className="vibecaster-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Chain Reaction</h2>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Start Chain
                </button>
              </div>
              <p className="text-vibecaster-pink-light mb-6">
                Start viral challenges and watch them grow. Create trends that spread across the community!
              </p>
            </div>

            {/* Chain Gallery */}
            <div className="vibecaster-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaImages size={20} />
                  Chain Gallery
                </h3>
                <button className="text-vibecaster-lavender hover:text-vibecaster-pink-light transition-colors">
                  View All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chainGalleryItems.map((item) => (
                  <div key={item.id} className="bg-vibecaster-purple-dark/20 rounded-lg overflow-hidden border border-vibecaster-lavender/20">
                    <div className="aspect-square bg-vibecaster-purple-dark relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <FaBolt size={14} className="text-yellow-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium mb-2">{item.title}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vibecaster-pink-light">{item.likes} likes</span>
                        <span className="text-vibecaster-pink-light">{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen vibecaster-bg">
      {/* Header Section with Enhanced Spacing and Animations */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-5 w-36 h-36 bg-vibecaster-lavender/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-5 w-36 h-36 bg-vibecaster-pink-light/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-vibecaster-purple-dark/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="flex items-center justify-center mb-8 lg:mb-10">
          <div className="text-center relative">
            {/* Animated Icon */}
            <div className="mb-4 flex justify-center">
              <div className={`text-3xl lg:text-4xl transform transition-all duration-500 ${
                isAnimating ? "scale-125 rotate-12" : "scale-100"
              }`}>
                {currentIcon}
              </div>
            </div>

            {/* Welcome Text with Enhanced Typography */}
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight font-mono">
              GM{" "}
              <span className="font-mono">
                <span className="text-vibecaster-purple-dark">Vi</span>
                <span className="text-vibecaster-pink-light">be</span>
                <span className="text-white">Caster</span>
              </span>
              {" "}fam! 🚀
            </h1>
            
            <p className="text-base lg:text-lg text-vibecaster-pink-light mb-6 max-w-xl mx-auto leading-relaxed">
              Another day to roast, create & vibe! Let's make some magic happen ✨
            </p>

            {/* Animated Feature Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-vibecaster-purple-dark/20 px-3 py-1 rounded-full">
                <FaFire className="text-red-400 w-4 h-4" />
                <span className="font-medium text-white text-sm">Roast</span>
              </div>
              <span className="text-vibecaster-lavender font-semibold text-sm">→</span>
              <div className="flex items-center gap-2 bg-vibecaster-purple-dark/20 px-3 py-1 rounded-full">
                <HiSparkles className="text-yellow-400 w-4 h-4" />
                <span className="font-medium text-white text-sm">Create</span>
              </div>
              <span className="text-vibecaster-lavender font-semibold text-sm">→</span>
              <div className="flex items-center gap-2 bg-vibecaster-purple-dark/20 px-3 py-1 rounded-full">
                <FaGem className="text-purple-400 w-4 h-4" />
                <span className="font-medium text-white text-sm">Connect</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs with Enhanced Spacing */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border ${
                  isActive
                    ? "bg-vibecaster-lavender text-white shadow-lg shadow-vibecaster-lavender/25 border-vibecaster-lavender"
                    : "text-white hover:bg-vibecaster-lavender/20 hover:shadow-md border-vibecaster-lavender/20"
                }`}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="vibecaster-card p-6 text-center group hover:shadow-lg hover:shadow-vibecaster-lavender/10 transition-all duration-300">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaFire size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Roast Me</h3>
              <p className="text-sm text-vibecaster-pink-light mb-4">
                Submit your selfie and get roasted by AI
              </p>
              <button 
                onClick={() => setActiveTab("roast")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Roasted
              </button>
            </div>

            <div className="vibecaster-card p-6 text-center group hover:shadow-lg hover:shadow-vibecaster-lavender/10 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaSnowflake size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Icebreaker</h3>
              <p className="text-sm text-vibecaster-pink-light mb-4">
                Answer quirky prompts and break the ice
              </p>
              <button 
                onClick={() => setActiveTab("icebreaker")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Break Ice
              </button>
            </div>

            <div className="vibecaster-card p-6 text-center group hover:shadow-lg hover:shadow-vibecaster-lavender/10 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaBolt size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chain Reaction</h3>
              <p className="text-sm text-vibecaster-pink-light mb-4">
                Start viral challenges and watch them grow
              </p>
              <button 
                onClick={() => setActiveTab("chain")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Start Chain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
