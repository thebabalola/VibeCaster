# VibeCaster Smart Contracts

This directory contains the smart contracts for VibeCaster, a Farcaster mini-app designed to enhance social interaction and engagement within the Farcaster ecosystem. The contracts implement three core viral mechanics: AI-generated roasts, quirky icebreakers, and viral chain challenges, along with a comprehensive points and badges system.

## 🎯 Project Overview

VibeCaster is a decentralized application (dApp) built on Farcaster, utilizing smart contracts, a frontend interface, and IPFS for data storage. The architecture is designed to be serverless, eliminating the need for a traditional backend.

### Core Features
- **🔥 Roast Me Mode**: Users submit selfies to receive AI-generated roasts with community voting
- **🧊 Icebreaker Mode**: Random quirky prompts for users to answer and create conversational threads
- **⚡ Chain Reaction Mode**: Viral challenge chains that grow across Farcaster casts
- **🏆 Points & Badges System**: Reward system for user engagement and participation

## 📋 Contract Details

### Deployed Contracts (Base Sepolia Testnet)

| Contract | Address | Description |
|----------|---------|-------------|
| **VibeCasterPoints** | `0xEe832dc966BC8D66742aA0c01bC7797116839634` | Manages user point balances and rewards |
| **VibeCasterBadges** | `0x5820440e686A5519ca5Eb1c6148C54d77DE23115` | NFT badges for achievements and milestones |
| **RoastMeContract** | `0x15978cDBe7cc4238825647b1A61d6efA9371D5C0` | Handles roast submissions and voting |
| **IcebreakerContract** | `0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B` | Manages icebreaker prompts and responses |
| **ChainReactionContract** | `0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9` | Controls viral challenge chains |
| **VibeCasterAdmin** | `0xfB462A2f915d45BE8292B8e81ca4bbe7d1072b50` | Central admin contract for contract management |

### Network Information
- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org
- **Deployer**: `0x0eE1F2b663547dAa487F57C517C7563AdCf86da0`

## 🏗️ Contract Architecture

### 1. VibeCasterPoints Contract
**Purpose**: Manages user point balances and rewards
- **Functions**:
  - `addPoints(address user, uint256 amount)`: Award points to users
  - `deductPoints(address user, uint256 amount)`: Deduct points from users
  - `getPoints(address user)`: Get user's point balance
  - `authorizeContract(address contract)`: Authorize contracts to award points

### 2. VibeCasterBadges Contract
**Purpose**: NFT badges for achievements and milestones
- **Functions**:
  - `mintBadge(address to, uint256 badgeId)`: Mint a new badge
  - `authorizeMinter(address minter)`: Authorize contracts to mint badges
  - `setPointsContract(address pointsContract)`: Link to points contract
  - `getUserBadges(address user)`: Get user's badge collection

### 3. RoastMeContract
**Purpose**: Handles roast submissions and community voting
- **Functions**:
  - `submitRoast(string memory imageUri, string memory roastText)`: Submit a roast
  - `voteRoast(uint256 roastId, bool isUpvote)`: Vote on a roast
  - `getTopRoasts(uint256 count)`: Get top-voted roasts
  - `getUserRoasts(address user)`: Get user's roast submissions

### 4. IcebreakerContract
**Purpose**: Manages icebreaker prompts and user responses
- **Functions**:
  - `getRandomPrompt()`: Get a random icebreaker prompt
  - `submitResponse(string memory promptId, string memory response)`: Submit response
  - `getPromptResponses(string memory promptId)`: Get all responses to a prompt
  - `getUserResponses(address user)`: Get user's responses

### 5. ChainReactionContract
**Purpose**: Controls viral challenge chains
- **Functions**:
  - `startChain(string memory challenge, string memory contentUri)`: Start a new chain
  - `joinChain(uint256 chainId, string memory responseUri)`: Join an existing chain
  - `getChain(uint256 chainId)`: Get chain details and responses
  - `getUserChains(address user)`: Get chains started by user

### 6. VibeCasterAdmin
**Purpose**: Central admin contract for contract management
- **Functions**:
  - `setContracts(address points, address badges, address roast, address icebreaker, address chainReaction)`: Set all contract addresses
  - `getContracts()`: Get all contract addresses
  - `updateContract(address contractType, address newAddress)`: Update individual contracts

## 🚀 Deployment

### Prerequisites
- Node.js and npm installed
- Hardhat and its dependencies installed
- A `.env` file with the following variables:
  ```
  PRIVATE_KEY=your_deployer_wallet_private_key
  BASESCAN_API_KEY=your_basescan_api_key
  BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/your_key
  ```

### Deployment Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Compile Contracts**:
   ```bash
   npm run compile
   ```

3. **Check Balance** (optional):
   ```bash
   npx hardhat run scripts/check-balance.ts --network base-sepolia
   ```

4. **Deploy Contracts**:
   ```bash
   npm run deploy
   ```

5. **Verify Contracts** (optional):
   ```bash
   npx hardhat verify --network base-sepolia CONTRACT_ADDRESS [constructor_args]
   ```

### Deployment Scripts
- `scripts/deploy.ts`: Main deployment script
- `scripts/check-balance.ts`: Check deployer balance
- `scripts/check-nonce.ts`: Check current nonce
- `scripts/complete-deployment.ts`: Complete partial deployments
- `scripts/finalize-deployment.ts`: Finalize contract setup

## 🔗 Contract Verification

All contracts are verified on BaseScan:
- **VibeCasterPoints**: [View on BaseScan](https://sepolia.basescan.org/address/0xEe832dc966BC8D66742aA0c01bC7797116839634)
- **VibeCasterBadges**: [View on BaseScan](https://sepolia.basescan.org/address/0x5820440e686A5519ca5Eb1c6148C54d77DE23115)
- **RoastMeContract**: [View on BaseScan](https://sepolia.basescan.org/address/0x15978cDBe7cc4238825647b1A61d6efA9371D5C0)
- **IcebreakerContract**: [View on BaseScan](https://sepolia.basescan.org/address/0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B)
- **ChainReactionContract**: [View on BaseScan](https://sepolia.basescan.org/address/0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9)
- **VibeCasterAdmin**: [View on BaseScan](https://sepolia.basescan.org/address/0xfB462A2f915d45BE8292B8e81ca4bbe7d1072b50)

## 🎨 Technical Architecture

### Smart Contract Stack
- **Platform**: Base (Ethereum L2)
- **Language**: Solidity 0.8.26
- **Framework**: Hardhat
- **Testing**: Hardhat Test Suite
- **Verification**: Sourcify + BaseScan

### Integration Points
- **Frontend**: React/Next.js with Wagmi for Web3 integration
- **Storage**: IPFS for decentralized content storage
- **Authentication**: Farcaster wallet integration
- **AI Services**: External APIs for roast generation

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run specific tests:
```bash
npx hardhat test test/VibeCaster.test.ts
```

## 📊 Gas Optimization

The contracts are optimized for gas efficiency:
- Efficient storage patterns
- Minimal external calls
- Optimized function selectors
- Batch operations where possible

## 🔒 Security Features

- **Access Control**: Only authorized contracts can mint badges and award points
- **Reentrancy Protection**: All external calls are protected
- **Input Validation**: Comprehensive parameter validation
- **Emergency Pause**: Admin can pause critical functions if needed

## 📈 Points System

### Earning Points
- **Roast Submission**: 10 points
- **Roast Vote**: 1 point per vote
- **Icebreaker Response**: 5 points
- **Chain Start**: 20 points
- **Chain Response**: 10 points
- **Daily Login**: 1 point

### Badge Categories
- **First Timer**: First participation in any mode
- **Roast Master**: Top roaster of the week
- **Icebreaker Pro**: Most active icebreaker user
- **Chain Starter**: Started most viral chains
- **Community Champion**: Most helpful community member

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions about the smart contracts:
- Create an issue in the GitHub repository
- Check the contract verification links above
- Review the test files for usage examples

---

**VibeCaster** - Making Farcaster more fun, one roast at a time! 🔥


