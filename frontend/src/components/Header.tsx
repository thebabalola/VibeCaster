"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import ConnectButton from "./ConnectButton";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { address, isConnected } = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-vibecaster-lavender/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-vibecaster-lavender to-vibecaster-pink-light rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-vibecaster-lavender">Vibe</span>
                <span className="text-red-500">e</span>
                <span className="text-white">Caster</span>
              </h1>
              <p className="text-xs text-vibecaster-pink-light">The Future of Social on Farcaster</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-white hover:text-vibecaster-lavender transition-colors">
              Dashboard
            </a>
            <a href="/gallery" className="text-white hover:text-vibecaster-lavender transition-colors">
              Gallery
            </a>
            <a href="/leaderboard" className="text-white hover:text-vibecaster-lavender transition-colors">
              Leaderboard
            </a>
            {isConnected && (
              <a href="/admin" className="text-vibecaster-pink-light hover:text-vibecaster-lavender transition-colors">
                Admin
              </a>
            )}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white hover:text-vibecaster-lavender transition-colors"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-vibecaster-lavender/20 pt-4">
            <div className="flex flex-col space-y-3">
              <a 
                href="/" 
                className="text-white hover:text-vibecaster-lavender transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </a>
              <a 
                href="/gallery" 
                className="text-white hover:text-vibecaster-lavender transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </a>
              <a 
                href="/leaderboard" 
                className="text-white hover:text-vibecaster-lavender transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </a>
              {isConnected && (
                <a 
                  href="/admin" 
                  className="text-vibecaster-pink-light hover:text-vibecaster-lavender transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
