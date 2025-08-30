import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying VibeCaster contracts with the account:", deployer.address);

  // Get current nonce
  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("Starting deployment with nonce:", nonce);

  try {
    // Deploy VibeCasterPoints
    console.log("Deploying VibeCasterPoints...");
    const VibeCasterPoints = await ethers.getContractFactory("VibeCasterPoints");
    const pointsContract = await VibeCasterPoints.deploy(deployer.address);
    await pointsContract.waitForDeployment();
    console.log("VibeCasterPoints deployed to:", await pointsContract.getAddress());

    // Deploy VibeCasterBadges
    console.log("Deploying VibeCasterBadges...");
    const VibeCasterBadges = await ethers.getContractFactory("VibeCasterBadges");
    const badgesContract = await VibeCasterBadges.deploy(
      deployer.address,
      "VibeCaster Badges",
      "VCB",
      "https://ipfs.io/ipfs/" // Base URI for badge metadata
    );
    await badgesContract.waitForDeployment();
    console.log("VibeCasterBadges deployed to:", await badgesContract.getAddress());

    // Deploy RoastMeContract
    console.log("Deploying RoastMeContract...");
    const RoastMeContract = await ethers.getContractFactory("RoastMeContract");
    const roastContract = await RoastMeContract.deploy(
      deployer.address,
      await pointsContract.getAddress(),
      await badgesContract.getAddress()
    );
    await roastContract.waitForDeployment();
    console.log("RoastMeContract deployed to:", await roastContract.getAddress());

    // Deploy IcebreakerContract
    console.log("Deploying IcebreakerContract...");
    const IcebreakerContract = await ethers.getContractFactory("IcebreakerContract");
    const icebreakerContract = await IcebreakerContract.deploy(
      deployer.address,
      await pointsContract.getAddress(),
      await badgesContract.getAddress()
    );
    await icebreakerContract.waitForDeployment();
    console.log("IcebreakerContract deployed to:", await icebreakerContract.getAddress());

    // Deploy ChainReactionContract
    console.log("Deploying ChainReactionContract...");
    const ChainReactionContract = await ethers.getContractFactory("ChainReactionContract");
    const chainReactionContract = await ChainReactionContract.deploy(
      deployer.address,
      await pointsContract.getAddress(),
      await badgesContract.getAddress()
    );
    await chainReactionContract.waitForDeployment();
    console.log("ChainReactionContract deployed to:", await chainReactionContract.getAddress());

    // Deploy VibeCasterAdmin
    console.log("Deploying VibeCasterAdmin...");
    const VibeCasterAdmin = await ethers.getContractFactory("VibeCasterAdmin");
    const adminContract = await VibeCasterAdmin.deploy(deployer.address);
    await adminContract.waitForDeployment();
    console.log("VibeCasterAdmin deployed to:", await adminContract.getAddress());

    // Set contracts in admin
    console.log("Setting contracts in VibeCasterAdmin...");
    await adminContract.setContracts(
      await pointsContract.getAddress(),
      await badgesContract.getAddress(),
      await roastContract.getAddress(),
      await icebreakerContract.getAddress(),
      await chainReactionContract.getAddress()
    );

    // Set points contract in badges contract
    console.log("Setting points contract in VibeCasterBadges...");
    await badgesContract.setPointsContract(await pointsContract.getAddress());

    // Authorize contracts in VibeCasterPoints
    console.log("Authorizing contracts in VibeCasterPoints...");
    await pointsContract.authorizeContract(await roastContract.getAddress());
    await pointsContract.authorizeContract(await icebreakerContract.getAddress());
    await pointsContract.authorizeContract(await chainReactionContract.getAddress());
    await pointsContract.authorizeContract(await adminContract.getAddress());
    console.log("Contracts authorized in VibeCasterPoints");

    // Authorize minters in VibeCasterBadges
    console.log("Authorizing minters in VibeCasterBadges...");
    await badgesContract.authorizeMinter(await roastContract.getAddress());
    await badgesContract.authorizeMinter(await icebreakerContract.getAddress());
    await badgesContract.authorizeMinter(await chainReactionContract.getAddress());
    await badgesContract.authorizeMinter(await adminContract.getAddress());
    console.log("Minters authorized in VibeCasterBadges");

    console.log("\n=== VIBECASTER DEPLOYMENT COMPLETE ===");
    console.log("VibeCasterPoints:", await pointsContract.getAddress());
    console.log("VibeCasterBadges:", await badgesContract.getAddress());
    console.log("RoastMeContract:", await roastContract.getAddress());
    console.log("IcebreakerContract:", await icebreakerContract.getAddress());
    console.log("ChainReactionContract:", await chainReactionContract.getAddress());
    console.log("VibeCasterAdmin:", await adminContract.getAddress());
    console.log("=====================================\n");

    // Save deployment addresses
    const deploymentInfo = {
      VibeCasterPoints: await pointsContract.getAddress(),
      VibeCasterBadges: await badgesContract.getAddress(),
      RoastMeContract: await roastContract.getAddress(),
      IcebreakerContract: await icebreakerContract.getAddress(),
      ChainReactionContract: await chainReactionContract.getAddress(),
      VibeCasterAdmin: await adminContract.getAddress(),
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
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
