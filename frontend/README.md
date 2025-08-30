# VibeCaster 🚀

**The Future of Social on Farcaster - AI Roasts, Icebreakers & Viral Challenges!**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-VibeCaster-blue?style=for-the-badge&logo=ethereum)](https://vibecaster.vercel.app)
[![Farcaster Mini App](https://img.shields.io/badge/Farcaster%20Mini%20App-Available-purple?style=for-the-badge)](https://farcaster.xyz/miniapps/vibecaster)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

## 🎯 Overview

VibeCaster is a revolutionary Farcaster mini-app that enhances social interaction and engagement within the Farcaster ecosystem. It integrates three core viral mechanics: AI-generated roasts, quirky icebreakers, and viral chain challenges. Built on Base Sepolia with a modern tech stack, VibeCaster provides a fun, interactive, and shareable experience directly within Farcaster frames.

### ✨ Key Features

- **🔥 AI Roast Me**: Submit selfies for hilarious AI-generated roasts
- **🧊 Icebreaker Mode**: Answer quirky prompts and create polls
- **⚡ Chain Reaction**: Start viral challenges and join the fun
- **🏆 Points & Badges**: Earn points and collect achievement badges
- **📱 Farcaster Integration**: Seamless wallet connection and sharing
- **🎨 Modern UI**: Dark theme with VibeCaster brand colors
- **🌐 Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or any Web3 wallet
- Base Sepolia testnet ETH

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebabalola/VibeCaster.git
   cd VibeCaster/frontend
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
   NEXT_PUBLIC_VIBECASTER_ADMIN_ADDRESS=0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10
   NEXT_PUBLIC_VIBECASTER_POINTS_ADDRESS=0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10
   NEXT_PUBLIC_VIBECASTER_BADGES_ADDRESS=0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10
   NEXT_PUBLIC_ROAST_ME_ADDRESS=0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10
   NEXT_PUBLIC_ICEBREAKER_ADDRESS=0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10
   NEXT_PUBLIC_CHAIN_REACTION_ADDRESS=0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_coinbase_api_key
   NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_huggingface_api_key
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 with custom VibeCaster theme
- **Web3**: Wagmi + Viem
- **Wallet Integration**: Farcaster Mini App Connector + Base MiniKit
- **UI Components**: Custom components with React Icons
- **State Management**: React hooks + TanStack Query
- **AI Integration**: Hugging Face Inference API
- **Storage**: IPFS via Pinata

### Smart Contracts (Base Sepolia)

- **VibeCasterAdmin**: Platform administration and authorization
- **VibeCasterPoints**: Points system and user rewards
- **VibeCasterBadges**: NFT badges and achievements
- **RoastMeContract**: AI roast submissions and voting
- **IcebreakerContract**: Prompts, polls, and responses
- **ChainReactionContract**: Viral challenges and responses

### Key Components

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main dashboard with navigation
│   ├── admin/             # Admin dashboard (authorized users)
│   └── api/               # API routes for contract data
├── components/            # Reusable React components
│   ├── VibeCasterDashboard.tsx  # Main dashboard component
│   ├── RoastMe.tsx        # AI roast functionality
│   ├── Icebreaker.tsx     # Icebreaker prompts and polls
│   ├── ChainReactionGallery.tsx # Viral challenges
│   ├── Activity.tsx       # User activity and stats
│   ├── Leaderboard.tsx    # Leaderboard display
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer with social links
│   └── ...
├── contexts/              # React contexts
│   └── wallet/           # Wallet connection context
├── lib/                   # Utility functions and configs
│   ├── wagmiConfig.ts    # Wagmi configuration
│   ├── abis/             # Smart contract ABIs
│   ├── hugApi.ts         # AI integration
│   ├── ipfs.ts           # IPFS upload utilities
│   └── ...
├── providers/             # React providers
│   └── MiniKitProvider.tsx # Base MiniKit integration
└── types/                 # TypeScript type definitions
```

## 🌟 Features in Detail

### 🔥 AI Roast Me
- **Image Upload**: Camera or file upload for selfies
- **AI Analysis**: Hugging Face models for image captioning and roast generation
- **Community Voting**: Vote on the funniest roasts
- **IPFS Storage**: Decentralized storage for images and metadata
- **Social Sharing**: Share roasts on Farcaster and Twitter

### 🧊 Icebreaker Mode
- **Dynamic Prompts**: Create and answer quirky prompts
- **Poll Creation**: Create polls for community engagement
- **Category Management**: Organize prompts by categories
- **Response Tracking**: Monitor engagement and responses

### ⚡ Chain Reaction
- **Challenge Creation**: Start viral challenges with images
- **Response System**: Join challenges and add responses
- **Viral Growth**: Challenges spread across Farcaster
- **Visual Content**: Image-based challenge system

### 🏆 Points & Badges System
- **Earning Points**: Participate in activities to earn points
- **Achievement Badges**: Collect NFT badges for milestones
- **Leaderboards**: Compete with other users
- **Progress Tracking**: Monitor your journey and achievements

### 🎨 Modern UI/UX
- **Dark Theme**: Sleek dark interface with VibeCaster colors
- **Gradient Backgrounds**: Vertical gradients for visual appeal
- **DM Mono Font**: Clean, modern typography
- **Responsive Design**: Optimized for all devices
- **Glass Effects**: Modern backdrop blur and transparency

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_VIBECASTER_ADMIN_ADDRESS` | Admin contract address | ✅ |
| `NEXT_PUBLIC_VIBECASTER_POINTS_ADDRESS` | Points contract address | ✅ |
| `NEXT_PUBLIC_VIBECASTER_BADGES_ADDRESS` | Badges contract address | ✅ |
| `NEXT_PUBLIC_ROAST_ME_ADDRESS` | RoastMe contract address | ✅ |
| `NEXT_PUBLIC_ICEBREAKER_ADDRESS` | Icebreaker contract address | ✅ |
| `NEXT_PUBLIC_CHAIN_REACTION_ADDRESS` | ChainReaction contract address | ✅ |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | ✅ |
| `NEXT_PUBLIC_CDP_CLIENT_API_KEY` | Coinbase API key | ✅ |
| `NEXT_PUBLIC_HUGGING_FACE_API_KEY` | Hugging Face API key | ✅ |
| `NEXT_PUBLIC_PINATA_JWT` | Pinata JWT for IPFS | ✅ |

### Smart Contract Deployment

All contracts are deployed on Base Sepolia testnet. See the [smart-contract README](../smart-contract/README.md) for deployment details.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic builds on push

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 Farcaster Mini App

VibeCaster is designed as a Farcaster Mini App, providing a native experience within the Farcaster ecosystem.

### Mini App Features
- **Automatic Wallet Connection**: Seamless Farcaster wallet integration
- **Optimized UI**: Tailored for Farcaster Frame experience
- **Social Integration**: Easy sharing with Farcaster community
- **Base MiniKit**: Enhanced Base ecosystem integration

## 🎨 Design System

### Color Palette
- **Primary**: `#0C0420` (Dark Purple)
- **Secondary**: `#5D3C64`, `#7B466A`, `#9F6496`
- **Accent**: `#D391B0`, `#BA6E8F`
- **Background**: Vertical gradient from `#0C0420` to `#5D3C64`

### Typography
- **Font**: DM Mono (400 weight)
- **Modern, clean aesthetic**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Network** for the scalable L2 infrastructure
- **Farcaster** for the social Web3 platform
- **Hugging Face** for AI model APIs
- **IPFS/Pinata** for decentralized storage
- **Vercel** for hosting and deployment

## 📞 Support

- **Documentation**: [https://vibecaster.vercel.app](https://vibecaster.vercel.app)
- **Issues**: [GitHub Issues](https://github.com/thebabalola/VibeCaster/issues)
- **Discord**: Join our community for support and discussions

## 🔗 Links

- **Live App**: [https://vibecaster.vercel.app](https://vibecaster.vercel.app)
- **Farcaster Mini App**: [https://farcaster.xyz/miniapps/vibecaster](https://farcaster.xyz/miniapps/vibecaster)
- **Smart Contracts**: [Base Sepolia Explorer](https://sepolia.basescan.org)
- **GitHub**: [https://github.com/thebabalola/VibeCaster](https://github.com/thebabalola/VibeCaster)

---

**Made with ❤️ by the VibeCaster team**

*GM VibeCaster fam! Let's make some magic happen! ✨*
