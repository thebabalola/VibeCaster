// src/lib/wagmiConfig.ts
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import {
  injected,
  walletConnect,
  metaMask,
  coinbaseWallet,
} from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

// Create WalletConnect connector only once
let walletConnectConnector: any = null;

const getWalletConnectConnector = () => {
  if (!walletConnectConnector) {
    walletConnectConnector = walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      metadata: {
        name: "VibeCaster",
        description: "The Future of Social on Farcaster - AI roasts, icebreakers, and viral challenges",
        url: "https://vibecasters.vercel.app", // Updated to correct URL
        icons: ["https://vibecasters.vercel.app/vibeCaster-logo.png"], // Updated to correct URL
      },
    });
  }
  return walletConnectConnector;
};

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  connectors: [
    // Farcaster Mini App connector as the primary option
    farcasterMiniApp({
      // Ensure proper configuration for Farcaster Mini App
      appName: "VibeCaster",
      appDescription: "The Future of Social on Farcaster",
      appIcon: "https://vibecasters.vercel.app/vibeCaster-logo.png",
    }),
    injected({
      target: "metaMask",
    }),
    metaMask(),
    coinbaseWallet({
      appName: "VibeCaster",
    }),
    getWalletConnectConnector(),
  ],
  ssr: false, // Disable SSR to avoid indexedDB issues
  multiInjectedProviderDiscovery: true,
});
