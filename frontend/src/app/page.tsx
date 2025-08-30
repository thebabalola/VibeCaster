"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VibeCasterDashboard from "../components/VibeCasterDashboard";
// import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

// Legacy MintMyMood components (commented for reference)
// import MiniHero from "../components/MiniHero";
// import MoodForm from "../components/MoodForm";
// import NFTGallery from "../components/NFTGallery";
// import { useReadContract, useAccount } from "wagmi";
// import { MintMyMoodABI } from "../lib/MintMyMoodABI";

// Legacy BackgroundEmojis component (commented for reference)
// const BackgroundEmojis = () => (
//   <div
//     className="absolute inset-0 -z-10 h-full w-full overflow-hidden"
//     aria-hidden="true"
//   >
//     <div className="relative h-full w-full">
//       <span className="absolute top-[5%] left-[10%] text-5xl opacity-5">
//         😊
//       </span>
//       <span className="absolute top-[15%] right-[15%] text-6xl opacity-5">
//         😢
//       </span>
//       <span className="absolute top-[30%] left-[25%] text-4xl opacity-5">
//         😠
//       </span>
//       <span className="absolute top-[50%] right-[30%] text-7xl opacity-5">
//         🤔
//       </span>
//       <span className="absolute top-[65%] left-[5%] text-6xl opacity-5">
//         😍
//       </span>
//       <span className="absolute bottom-[10%] right-[10%] text-5xl opacity-5">
//         😂
//       </span>
//       <span className="absolute bottom-[25%] left-[40%] text-4xl opacity-5">
//         🥳
//       </span>
//       <span className="absolute top-[80%] right-[50%] text-6xl opacity-5">
//         😴
//       </span>
//     </div>
//   </div>
// );

export default function Home() {
  // Preserve MiniKit functionality (temporarily commented)
  // const { setFrameReady, isFrameReady } = useMiniKit();

  // Legacy MintMyMood logic (commented for reference)
  // const { address } = useAccount();
  // const { data: streak } = useReadContract({
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  //   abi: MintMyMoodABI,
  //   functionName: "streakCount",
  //   args: [address],
  // });

  // useEffect(() => {
  //   if (!isFrameReady) setFrameReady();
  // }, [isFrameReady, setFrameReady]);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* VibeCaster Header */}
      <Header />

      {/* Main VibeCaster Dashboard */}
      <main className="flex-grow">
        <VibeCasterDashboard />
      </main>

      {/* VibeCaster Footer */}
      <Footer />
    </div>
  );
}
