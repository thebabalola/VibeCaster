"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VibeCasterDashboard from "../components/VibeCasterDashboard";
// import { useMiniKit } from '@coinbase/onchainkit/minikit';
// import { useEffect } from 'react';

export default function Home() {
  // Preserve MiniKit functionality (temporarily commented)
  // const { setFrameReady, isFrameReady } = useMiniKit();

  // useEffect(() => {
  //   if (!isFrameReady) setFrameReady();
  // }, [isFrameReady, setFrameReady]);

  return (
    <div className="min-h-screen vibecaster-bg flex flex-col">
      {/* VibeCaster Header */}
      <Header />

      {/* Main VibeCaster Dashboard */}
      <div className="flex-1 px-4 md:px-6 lg:px-8">
        <VibeCasterDashboard />
      </div>

      {/* VibeCaster Footer */}
      <Footer />
    </div>
  );
}
