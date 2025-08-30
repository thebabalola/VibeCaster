"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import ConnectButton from "./ConnectButton";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function Header() {
  const { address, isConnected } = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/vibecaster-logo.png"
              alt="VibeCaster Logo"
              width={150}
              height={150}
              className="rounded-lg"
            />
          </div>

          {/* Desktop Navigation - Only Admin */}
          <nav className="hidden md:flex items-center space-x-6">
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

        {/* Mobile Navigation - Only Admin */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-vibecaster-lavender/20 pt-4">
            <div className="flex flex-col space-y-3">
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
