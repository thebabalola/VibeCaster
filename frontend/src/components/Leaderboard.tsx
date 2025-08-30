"use client";

import { FaTools, FaHammer } from "react-icons/fa";

export default function Leaderboard() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-vibecaster-dark/30 backdrop-blur-sm rounded-full border border-vibecaster-lavender/20 flex items-center justify-center">
          <FaTools size={32} className="text-vibecaster-lavender" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-vibecaster-lavender mb-4">Leaderboard</h2>
      <p className="text-vibecaster-light-purple text-lg mb-6">Under Construction</p>
      
      <div className="flex justify-center items-center gap-2 text-vibecaster-light-purple">
        <FaHammer size={16} />
        <span className="text-sm">Coming soon with epic rankings and rewards!</span>
      </div>
    </div>
  );
}
