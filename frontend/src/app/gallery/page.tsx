"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NFTGallery from "../../components/NFTGallery";

export default function Gallery() {
  return (
    <div className="min-h-screen vibecaster-bg flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-vibecaster-lavender">
          The Mood Stream
        </h1>
        <NFTGallery />
      </main>
      <Footer />
    </div>
  );
}
