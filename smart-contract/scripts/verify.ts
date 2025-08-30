import { run } from "hardhat";

async function main() {
  // Contract addresses from successful deployment
  const VIBECASTER_POINTS_ADDRESS = "0xEe832dc966BC8D66742aA0c01bC7797116839634";
  const VIBECASTER_BADGES_ADDRESS = "0x5820440e686A5519ca5Eb1c6148C54d77DE23115";
  const ROAST_ME_CONTRACT_ADDRESS = "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0";
  const ICEBREAKER_CONTRACT_ADDRESS = "0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B";
  const CHAIN_REACTION_CONTRACT_ADDRESS = "0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9";
  const VIBECASTER_ADMIN_ADDRESS = "0xfB462A2f915d45BE8292B8e81ca4bbe7d1072b50";

  console.log("Verifying VibeCaster contracts on Base Sepolia...");

  try {
    // Verify VibeCasterPoints
    console.log("Verifying VibeCasterPoints...");
    await run("verify:verify", {
      address: VIBECASTER_POINTS_ADDRESS,
      constructorArguments: ["0x0eE1F2b663547dAa487F57C517C7563AdCf86da0"],
      contract: "contracts/VibeCasterPoints.sol:VibeCasterPoints"
    });

    // Verify VibeCasterBadges
    console.log("Verifying VibeCasterBadges...");
    await run("verify:verify", {
      address: VIBECASTER_BADGES_ADDRESS,
      constructorArguments: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0",
        "VibeCaster Badges",
        "VCB",
        "https://ipfs.io/ipfs/"
      ],
      contract: "contracts/VibeCasterBadges.sol:VibeCasterBadges"
    });

    // Verify RoastMeContract
    console.log("Verifying RoastMeContract...");
    await run("verify:verify", {
      address: ROAST_ME_CONTRACT_ADDRESS,
      constructorArguments: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0",
        VIBECASTER_POINTS_ADDRESS,
        VIBECASTER_BADGES_ADDRESS
      ],
      contract: "contracts/RoastMeContract.sol:RoastMeContract"
    });

    // Verify IcebreakerContract
    console.log("Verifying IcebreakerContract...");
    await run("verify:verify", {
      address: ICEBREAKER_CONTRACT_ADDRESS,
      constructorArguments: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0",
        VIBECASTER_POINTS_ADDRESS,
        VIBECASTER_BADGES_ADDRESS
      ],
      contract: "contracts/IcebreakerContract.sol:IcebreakerContract"
    });

    // Verify ChainReactionContract
    console.log("Verifying ChainReactionContract...");
    await run("verify:verify", {
      address: CHAIN_REACTION_CONTRACT_ADDRESS,
      constructorArguments: [
        "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0",
        VIBECASTER_POINTS_ADDRESS,
        VIBECASTER_BADGES_ADDRESS
      ],
      contract: "contracts/ChainReactionContract.sol:ChainReactionContract"
    });

    // Verify VibeCasterAdmin
    console.log("Verifying VibeCasterAdmin...");
    await run("verify:verify", {
      address: VIBECASTER_ADMIN_ADDRESS,
      constructorArguments: ["0x0eE1F2b663547dAa487F57C517C7563AdCf86da0"],
      contract: "contracts/VibeCasterAdmin.sol:VibeCasterAdmin"
    });

    console.log("All contracts verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
