"use client";

import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="glass-effect border-t border-vibecaster-lavender/20 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* VibeCaster Brand */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-vibecaster-lavender to-vibecaster-pink-light rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">VC</span>
            </div>
            <div>
              <p className="text-sm text-white">
                <span className="text-vibecaster-lavender">Vibe</span>
                <span className="text-red-500">e</span>
                <span className="text-white">Caster</span>
              </p>
              <p className="text-xs text-vibecaster-pink-light">The Future of Social on Farcaster</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com/vibecaster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vibecaster-pink-light hover:text-vibecaster-lavender transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://github.com/vibecaster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vibecaster-pink-light hover:text-vibecaster-lavender transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://discord.gg/vibecaster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vibecaster-pink-light hover:text-vibecaster-lavender transition-colors"
            >
              <FaDiscord size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-vibecaster-lavender/10 text-center">
          <p className="text-xs text-vibecaster-pink-light">
            © 2024 VibeCaster. Built on Base. Powered by Farcaster.
          </p>
        </div>
      </div>
    </footer>
  );
}
