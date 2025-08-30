"use client";

import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Wallet, AlertTriangle, LogOut } from "lucide-react";
import { useState } from "react";

const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const WalletConnection = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChainSelector, setShowChainSelector] = useState(false);

  // Check if user is on wrong chain
  const isWrongChain = account.isConnected && account.chain?.id !== baseSepolia.id;

  const handleCopy = () => {
    if (account.address) {
      navigator.clipboard.writeText(account.address);
    }
  };

  const handleSwitchChain = async () => {
    try {
      await switchChain({ chainId: baseSepolia.id });
      setShowChainSelector(false);
    } catch (error) {
      console.error("Failed to switch chain:", error);
      // If switching fails, try to add the network
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${baseSepolia.id.toString(16)}`,
                chainName: baseSepolia.name,
                rpcUrls: [baseSepolia.rpcUrls.default.http[0]],
                blockExplorerUrls: [baseSepolia.blockExplorers?.default.url],
                nativeCurrency: baseSepolia.nativeCurrency,
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm font-semibold transition-colors relative ${
          isWrongChain 
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
            : "bg-gray-100 text-[#222222] hover:bg-gray-200"
        }`}
      >
        {/* Warning indicator for wrong chain */}
        {isWrongChain && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full animate-pulse border-2 border-white"></div>
        )}
        <Wallet className="h-4 w-4" />
        <span>{shortenAddress(account.address!)}</span>
        {isWrongChain && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
        <Icon icon="radix-icons:caret-down" className="w-4 h-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50">
          {/* Chain warning section at top */}
          {isWrongChain && (
            <div className="mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-yellow-600 h-4 w-4" />
                <span className="text-yellow-800 font-medium text-sm">
                  Wrong Network: {account.chain?.name || "Unknown"}
                </span>
              </div>

              {!showChainSelector ? (
                <button
                  onClick={() => setShowChainSelector(true)}
                  className="flex items-center gap-2 rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700 w-full justify-center"
                >
                  <Icon icon="mdi:ethereum" className="w-4 h-4" />
                  Switch to {baseSepolia.name}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-yellow-700 mb-1">
                    Switch to supported network:
                  </div>
                  <button
                    onClick={handleSwitchChain}
                    disabled={isSwitching}
                    className="flex items-center justify-center gap-2 rounded px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50 transition-all bg-[#0052FF]"
                  >
                    {isSwitching ? (
                      <Icon icon="codex:loader" className="w-4 h-4 animate-spin" />
                    ) : null}
                    {baseSepolia.name}
                  </button>
                  <button
                    onClick={() => setShowChainSelector(false)}
                    className="text-xs text-yellow-700 hover:text-yellow-900 text-center"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              handleCopy();
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#222222] hover:bg-gray-100"
          >
            <Icon icon="solar:copy-line-duotone" className="w-5 h-5" />
            <span>Copy Address</span>
          </button>
          
          {account.chain?.blockExplorers?.default.url && (
            <a
              href={`${account.chain.blockExplorers.default.url}/address/${account.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#222222] hover:bg-gray-100"
            >
              <Icon icon="gridicons:external" className="w-5 h-5" />
              <span>View on Explorer</span>
            </a>
          )}
          
          <div className="my-1 h-px bg-gray-200" />
          
          <button
            onClick={() => {
              disconnect();
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#FF6B6B] hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
