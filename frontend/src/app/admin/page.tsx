"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { FaCrown, FaUsers, FaChartLine, FaCog, FaLock, FaBolt } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Admin wallet addresses (to be updated with actual admin addresses)
const ADMIN_ADDRESSES = [
  "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0", // Deployer address
  // Add more admin addresses here
];

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    if (address && isConnected) {
      const adminCheck = ADMIN_ADDRESSES.includes(address.toLowerCase());
      setIsAdmin(adminCheck);
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  }, [address, isConnected]);

  // Mock admin data
  const adminStats = {
    totalUsers: 1247,
    totalRoasts: 3421,
    totalChains: 156,
    totalPoints: 45678,
  };

  const recentActions = [
    { action: "Updated points system", timestamp: "2h ago", user: "Admin" },
    { action: "Added new icebreaker prompts", timestamp: "4h ago", user: "Admin" },
    { action: "Fixed chain reaction bug", timestamp: "1d ago", user: "Admin" },
  ];

  return (
    <div className="min-h-screen vibecaster-bg">
      <Header />
      
      {isLoading ? (
        <div className="flex items-center justify-center flex-grow">
          <div className="text-white">Loading...</div>
        </div>
      ) : !isConnected ? (
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <FaLock size={64} className="text-vibecaster-lavender mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
            <p className="text-vibecaster-pink-light">Please connect your wallet to access admin features.</p>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <FaCrown size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
            <p className="text-vibecaster-pink-light mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-white/60">
              Address: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          {/* Admin Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                <FaCrown className="inline text-vibecaster-lavender mr-3" />
                VibeCaster Admin
              </h1>
              <p className="text-vibecaster-pink-light">
                Platform management and analytics
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-vibecaster-pink-light">Admin Access</p>
              <p className="text-xs text-white/60 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="vibecaster-card p-6 text-center">
              <FaUsers size={32} className="text-vibecaster-lavender mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{adminStats.totalUsers}</div>
              <div className="text-sm text-vibecaster-pink-light">Total Users</div>
            </div>
            
            <div className="vibecaster-card p-6 text-center">
              <FaChartLine size={32} className="text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{adminStats.totalRoasts}</div>
              <div className="text-sm text-vibecaster-pink-light">Total Roasts</div>
            </div>
            
            <div className="vibecaster-card p-6 text-center">
              <FaBolt size={32} className="text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{adminStats.totalChains}</div>
              <div className="text-sm text-vibecaster-pink-light">Viral Chains</div>
            </div>
            
            <div className="vibecaster-card p-6 text-center">
              <FaCog size={32} className="text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{adminStats.totalPoints}</div>
              <div className="text-sm text-vibecaster-pink-light">Points Awarded</div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="vibecaster-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-vibecaster-lavender hover:bg-vibecaster-lavender/80 text-white px-4 py-2 rounded-lg transition-colors">
                  Update Points System
                </button>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Manage Roasts
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Add Icebreaker Prompts
                </button>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Monitor Chains
                </button>
              </div>
            </div>

            {/* Recent Actions */}
            <div className="vibecaster-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Actions</h2>
              <div className="space-y-3">
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20">
                    <div>
                      <div className="text-white font-medium">{action.action}</div>
                      <div className="text-xs text-vibecaster-pink-light">{action.user}</div>
                    </div>
                    <div className="text-xs text-vibecaster-pink-light">{action.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="vibecaster-card p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <span className="text-white">Smart Contracts</span>
                <span className="text-green-400">✓ Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <span className="text-white">IPFS Storage</span>
                <span className="text-green-400">✓ Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <span className="text-white">AI Services</span>
                <span className="text-green-400">✓ Online</span>
              </div>
            </div>
          </div>
        </main>
      )}
      
      <Footer />
    </div>
  );
}
