import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Verifying VibeCaster contracts on BaseScan...\n");

  // Contract addresses from successful deployment
  const contracts = [
    {
      name: "VibeCasterPoints",
      address: "0xEe832dc966BC8D66742aA0c01bC7797116839634",
      constructorArgs: ["0x0eE1F2b663547dAa487F57C517C7563AdCf86da0"] // deployer address
    },
    {
      name: "VibeCasterBadges",
      address: "0x5820440e686A5519ca5Eb1c6148C54d77DE23115",
      constructorArgs: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0", // owner
        "VibeCaster Badges", // name
        "VCB", // symbol
        "https://ipfs.io/ipfs/" // baseURI
      ]
    },
    {
      name: "RoastMeContract",
      address: "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0",
      constructorArgs: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0", // owner
        "0xEe832dc966BC8D66742aA0c01bC7797116839634", // points contract
        "0x5820440e686A5519ca5Eb1c6148C54d77DE23115"  // badges contract
      ]
    },
    {
      name: "IcebreakerContract",
      address: "0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B",
      constructorArgs: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0", // owner
        "0xEe832dc966BC8D66742aA0c01bC7797116839634", // points contract
        "0x5820440e686A5519ca5Eb1c6148C54d77DE23115"  // badges contract
      ]
    },
    {
      name: "ChainReactionContract",
      address: "0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9",
      constructorArgs: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0", // owner
        "0xEe832dc966BC8D66742aA0c01bC7797116839634", // points contract
        "0x5820440e686A5519ca5Eb1c6148C54d77DE23115"  // badges contract
      ]
    },
    {
      name: "VibeCasterAdmin",
      address: "0xfB462A2f915d45BE8292B8e81ca4bbe7d1072b50",
      constructorArgs: ["0x0eE1F2b663547dAa487F57C517C7563AdCf86da0"] // owner
    }
  ];

  console.log("📋 Contracts to verify:");
  contracts.forEach(contract => {
    console.log(`  - ${contract.name}: ${contract.address}`);
  });
  console.log();

  console.log("🚀 Starting verification process...\n");

  for (const contract of contracts) {
    try {
      console.log(`🔍 Verifying ${contract.name}...`);
      
      // Run hardhat verify command
      const { exec } = require('child_process');
      const verifyCommand = `npx hardhat verify --network base-sepolia ${contract.address} ${contract.constructorArgs.join(' ')}`;
      
      exec(verifyCommand, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(`❌ Failed to verify ${contract.name}: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`⚠️  Warning for ${contract.name}: ${stderr}`);
        }
        console.log(`✅ ${contract.name} verification output:`);
        console.log(stdout);
        console.log(`🔗 View on BaseScan: https://sepolia.basescan.org/address/${contract.address}\n`);
      });

      // Add delay between verifications to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.log(`❌ Error verifying ${contract.name}:`, error);
    }
  }

  console.log("🎉 Verification process completed!");
  console.log("\n📋 Manual verification commands:");
  console.log("If automatic verification fails, run these commands manually:");
  console.log();
  
  contracts.forEach(contract => {
    console.log(`# ${contract.name}`);
    console.log(`npx hardhat verify --network base-sepolia ${contract.address} ${contract.constructorArgs.join(' ')}`);
    console.log();
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
