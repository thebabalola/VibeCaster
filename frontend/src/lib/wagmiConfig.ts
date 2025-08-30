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
        url: "https://vibecaster.vercel.app", // Updated to VibeCaster URL
        icons: ["https://vibecaster.vercel.app/vibeCaster-logo.png"], // Updated to VibeCaster logo
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
    farcasterMiniApp(),
    injected({
      target: "metaMask",
    }),
    metaMask(),
    coinbaseWallet({
      appName: "VibeCaster", // Updated to VibeCaster
    }),
    getWalletConnectConnector(),
  ],
  ssr: false, // Disable SSR to avoid indexedDB issues
  multiInjectedProviderDiscovery: true,
});
