"use client";

import React, { useState } from 'react';
import { FaFire, FaSnowflake, FaBolt, FaSync, FaTrophy } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function Activity() {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-vibecaster-lavender mb-2">Activity Dashboard</h2>
        <p className="text-vibecaster-light-purple">Track your VibeCaster journey and achievements</p>
      </div>

      {/* Main Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Card */}
        <div className="lg:col-span-1">
          <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-6 border border-vibecaster-lavender/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">On-chain Points</h2>
              <button className="text-vibecaster-lavender hover:text-vibecaster-light-purple transition-colors">
                <FaSync size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-vibecaster-lavender">{userPoints}</div>
                <div className="text-sm text-vibecaster-light-purple">Total Points</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-vibecaster-light-purple">{userLevel}</div>
                <div className="text-sm text-vibecaster-light-purple">Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-vibecaster-dark/30 backdrop-blur-sm rounded-lg p-6 border border-vibecaster-lavender/20">
            {/* Quick Stats - Inside the Recent Activity container, above the header */}
            <div className="bg-vibecaster-dark/50 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-xl font-bold text-vibecaster-lavender">42</div>
                  <div className="text-xs text-vibecaster-light-purple">Total Roasts</div>
                </div>
                <div className="p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-xl font-bold text-vibecaster-lavender">156</div>
                  <div className="text-xs text-vibecaster-light-purple">Chain Reactions</div>
                </div>
                <div className="p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-xl font-bold text-vibecaster-lavender">89</div>
                  <div className="text-xs text-vibecaster-light-purple">Icebreakers</div>
                </div>
                <div className="p-3 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-xl font-bold text-vibecaster-lavender">#12</div>
                  <div className="text-xs text-vibecaster-light-purple">Leaderboard Rank</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button className="text-vibecaster-lavender hover:text-vibecaster-light-purple transition-colors text-sm">
                View Leaderboard
              </button>
            </div>

            {/* Activity Filters */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActivityFilter("all")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activityFilter === "all"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
                    : "text-white hover:bg-vibecaster-lavender/20"
                }`}
              >
                All ({recentActivities.length})
              </button>
              <button
                onClick={() => setActivityFilter("roast")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activityFilter === "roast"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
                    : "text-white hover:bg-vibecaster-lavender/20"
                }`}
              >
                Roasts
              </button>
              <button
                onClick={() => setActivityFilter("chain")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activityFilter === "chain"
                    ? "bg-vibecaster-lavender text-vibecaster-dark"
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
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-vibecaster-dark/50 border border-vibecaster-lavender/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-vibecaster-lavender/20 flex items-center justify-center">
                        {activity.type === "roast" && <FaFire size={14} className="text-red-400" />}
                        {activity.type === "icebreaker" && <FaSnowflake size={14} className="text-blue-400" />}
                        {activity.type === "chain" && <FaBolt size={14} className="text-yellow-400" />}
                      </div>
                      <div>
                        <div className="text-white font-medium">{activity.title}</div>
                        <div className="text-xs text-vibecaster-light-purple">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-vibecaster-lavender font-bold">{activity.points}</div>
                  </div>
                ))}
            </div>

            {/* Roast Gallery - Show only when roast filter is active */}
            {activityFilter === "roast" && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-vibecaster-lavender mb-4">Recent Roasts</h4>
                <div className="space-y-3">
                  {roastGalleryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-vibecaster-dark/50 border border-vibecaster-lavender/20">
                      <div className="w-12 h-12 rounded-lg bg-vibecaster-lavender/20 flex items-center justify-center">
                        <FaFire size={20} className="text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-vibecaster-light-purple">
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
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-vibecaster-lavender mb-4">Chain Reactions</h4>
                <div className="space-y-3">
                  {chainGalleryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-vibecaster-dark/50 border border-vibecaster-lavender/20">
                      <div className="w-12 h-12 rounded-lg bg-vibecaster-lavender/20 flex items-center justify-center">
                        <FaBolt size={20} className="text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-vibecaster-light-purple">
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




    </div>
  );
}
