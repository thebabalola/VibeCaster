# VibeCaster 🚀

**The Future of Social on Farcaster - Roast, Create & Connect!**

## 🎯 Overview

VibeCaster is a revolutionary Web3 social platform built on Base that combines AI-powered roasting, interactive icebreakers, and viral chain reactions. Built with modern web technologies and deeply integrated with Farcaster, it provides a unique social experience for creating, sharing, and connecting through humor and creativity.

## 📁 Project Structure

This repository contains the complete VibeCaster project with the following components:

```
VibeCaster/
├── frontend/                 # Next.js frontend application
├── smart-contract/          # Smart contracts (Solidity + Hardhat)
└── badge-n-metadata/        # Badge images and metadata
```

### 🏗️ Smart Contracts (`smart-contract/`)

- **Network**: Base mainnet
- **Framework**: Hardhat
- **Contracts**:
  - `VibeCasterAdmin.sol` - Central admin for platform management
  - `VibeCasterPoints.sol` - User points and rewards system
  - `VibeCasterBadges.sol` - NFT badges for achievements
  - `RoastMeContract.sol` - AI-powered roast submissions and voting
  - `IcebreakerContract.sol` - Interactive prompts, responses, and polls
  - `ChainReactionContract.sol` - Viral challenges and responses

### 🎨 Frontend (`frontend/`)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi + Viem
- **Wallet Integration**: Farcaster Mini App Connector
- **AI Integration**: Hugging Face Inference API
- **Storage**: IPFS (Pinata) for decentralized content storage

### 🏆 Badge System (`badge-n-metadata/`)

- **Badge Images**: PNG files for achievements
- **Metadata**: JSON files for badge descriptions and requirements

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Hardhat (for smart contract development)
- MetaMask or any Web3 wallet
- Base mainnet ETH
- Hugging Face API key (for AI features)

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_coinbase_api_key
   NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_huggingface_api_key
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to http://localhost:3000

### Smart Contract Setup

1. **Navigate to contract directory**
   ```bash
   cd smart-contract
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with:
   BASE_RPC_URL=your_base_rpc_url
   BASESCAN_API_KEY=your_basescan_api_key
   PRIVATE_KEY=your_private_key
   ```

4. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

5. **Run tests**
   ```bash
   npx hardhat test
   ```

## ✨ Key Features

### 🔥 **Roast Me**
- **AI-Powered Roasting**: Upload images and get hilarious AI-generated roasts
- **Community Voting**: Vote on the best roasts and earn points
- **Farcaster Sharing**: Share your roasts directly to Farcaster
- **IPFS Storage**: Decentralized storage for images and roast content

### ❄️ **Icebreaker**
- **Interactive Prompts**: Create and answer fun icebreaker questions
- **Community Polls**: Create polls and see community responses
- **Category System**: Organized prompts by categories
- **Response Tracking**: Track engagement and responses

### ⚡ **Chain Reaction**
- **Viral Challenges**: Start and join viral challenges
- **Community Participation**: Watch challenges spread across the community
- **Response Tracking**: Monitor challenge responses and engagement
- **Viral Mechanics**: Built-in viral sharing and participation

### 🏆 **Activity & Rewards**
- **Points System**: Earn points for participation and engagement
- **Badge System**: Unlock achievements and collect NFT badges
- **Leaderboard**: Compete with other users for top positions
- **Activity Tracking**: Monitor your social engagement

### 👑 **Admin Dashboard**
- **Contract Management**: Manage all smart contracts from one interface
- **User Management**: Award/deduct points and manage user permissions
- **Badge Management**: Upload and manage achievement badges
- **Platform Control**: Full administrative control over the platform

## 🔗 Links

- **Live App**: [vibecaster.vercel.app](https://vibecaster.vercel.app)
- **Farcaster Mini App**: [Farcaster Mini App](https://farcaster.xyz/miniapps/vibecaster)
- **Smart Contracts**: [Base Explorer](https://basescan.org/address/vibecaster)
- **GitHub**: [github.com/thebabalola/VibeCaster](https://github.com/thebabalola/VibeCaster)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS 4** - Utility-first CSS framework
- **Wagmi + Viem** - Web3 hooks and utilities
- **Farcaster Mini App** - Social wallet integration
- **Hugging Face API** - AI model integration
- **IPFS (Pinata)** - Decentralized storage

### Smart Contracts
- **Solidity** - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security libraries
- **Base Network** - Layer 2 scaling solution

### AI & Storage
- **Hugging Face** - AI model inference
- **IPFS** - Decentralized file storage
- **Pinata** - IPFS pinning service

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ by the VibeCaster team**

_Roast, Create & Connect - The Future of Social on Farcaster! 🚀✨_
