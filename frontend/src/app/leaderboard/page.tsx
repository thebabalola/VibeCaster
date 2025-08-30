"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaHardHat } from "react-icons/fa";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen vibecaster-bg flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="w-full max-w-lg vibecaster-card p-8 sm:p-12 rounded-2xl shadow-lg">
          <FaHardHat className="text-6xl sm:text-7xl text-vibecaster-lavender mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Leaderboard Coming Soon!
          </h1>
          <p className="text-vibecaster-pink-light leading-relaxed">
            We're busy crafting an exciting leaderboard where you can track the
            longest streaks and see who's the most consistent mood minter in the
            community. Stay tuned!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
