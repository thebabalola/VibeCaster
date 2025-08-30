import { ethers } from "hardhat";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Finalizing VibeCaster deployment with account:", deployer.address);

  // Contract addresses from the partial deployment
  const VibeCasterPoints = "0xEe832dc966BC8D66742aA0c01bC7797116839634";
  const VibeCasterBadges = "0x5820440e686A5519ca5Eb1c6148C54d77DE23115";
  const RoastMeContract = "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0";
  const IcebreakerContract = "0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B";
  const ChainReactionContract = "0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9";
  const VibeCasterAdmin = "0xfB462A2f915d45BE8292B8e81ca4bbe7d1072b50";

  try {
    // Get contract instances
    const pointsContract = await ethers.getContractAt("VibeCasterPoints", VibeCasterPoints);
    const badgesContract = await ethers.getContractAt("VibeCasterBadges", VibeCasterBadges);
    const adminContract = await ethers.getContractAt("VibeCasterAdmin", VibeCasterAdmin);

    // Wait a bit for network to settle
    console.log("Waiting for network to settle...");
    await sleep(5000);

    // Set points contract in badges contract
    console.log("Setting points contract in VibeCasterBadges...");
    const setPointsTx = await badgesContract.setPointsContract(VibeCasterPoints);
    await setPointsTx.wait();
    console.log("Points contract set in badges contract");

    await sleep(2000);

    // Authorize contracts in VibeCasterPoints one by one with delays
    console.log("Authorizing contracts in VibeCasterPoints...");
    
    console.log("Authorizing RoastMeContract...");
    const authRoastTx = await pointsContract.authorizeContract(RoastMeContract);
    await authRoastTx.wait();
    await sleep(2000);

    console.log("Authorizing IcebreakerContract...");
    const authIcebreakerTx = await pointsContract.authorizeContract(IcebreakerContract);
    await authIcebreakerTx.wait();
    await sleep(2000);

    console.log("Authorizing ChainReactionContract...");
    const authChainTx = await pointsContract.authorizeContract(ChainReactionContract);
    await authChainTx.wait();
    await sleep(2000);

    console.log("Authorizing VibeCasterAdmin...");
    const authAdminTx = await pointsContract.authorizeContract(VibeCasterAdmin);
    await authAdminTx.wait();
    console.log("All contracts authorized in VibeCasterPoints");

    await sleep(2000);

    // Authorize minters in VibeCasterBadges one by one with delays
    console.log("Authorizing minters in VibeCasterBadges...");
    
    console.log("Authorizing RoastMeContract as minter...");
    const authRoastMinterTx = await badgesContract.authorizeMinter(RoastMeContract);
    await authRoastMinterTx.wait();
    await sleep(2000);

    console.log("Authorizing IcebreakerContract as minter...");
    const authIcebreakerMinterTx = await badgesContract.authorizeMinter(IcebreakerContract);
    await authIcebreakerMinterTx.wait();
    await sleep(2000);

    console.log("Authorizing ChainReactionContract as minter...");
    const authChainMinterTx = await badgesContract.authorizeMinter(ChainReactionContract);
    await authChainMinterTx.wait();
    await sleep(2000);

    console.log("Authorizing VibeCasterAdmin as minter...");
    const authAdminMinterTx = await badgesContract.authorizeMinter(VibeCasterAdmin);
    await authAdminMinterTx.wait();
    console.log("All minters authorized in VibeCasterBadges");

    console.log("\n=== VIBECASTER DEPLOYMENT FINALIZED ===");
    console.log("VibeCasterPoints:", VibeCasterPoints);
    console.log("VibeCasterBadges:", VibeCasterBadges);
    console.log("RoastMeContract:", RoastMeContract);
    console.log("IcebreakerContract:", IcebreakerContract);
    console.log("ChainReactionContract:", ChainReactionContract);
    console.log("VibeCasterAdmin:", VibeCasterAdmin);
    console.log("=====================================\n");

    // Save deployment addresses
    const deploymentInfo = {
      VibeCasterPoints: VibeCasterPoints,
      VibeCasterBadges: VibeCasterBadges,
      RoastMeContract: RoastMeContract,
      IcebreakerContract: IcebreakerContract,
      ChainReactionContract: ChainReactionContract,
      VibeCasterAdmin: VibeCasterAdmin,
      deployer: deployer.address,
      network: (await ethers.provider.getNetwork()).name,
      timestamp: new Date().toISOString()
    };

    console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("Deployment info saved to deployment.json");

  } catch (error) {
    console.error("Finalization failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
