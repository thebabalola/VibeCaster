import { expect } from "chai";
import { ethers } from "hardhat";

describe("VibeCaster Contracts", function () {
  let pointsContract: any;
  let badgesContract: any;
  let roastContract: any;
  let icebreakerContract: any;
  let chainReactionContract: any;
  let adminContract: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;
  let admin1: any;

  beforeEach(async function () {
    [owner, user1, user2, user3, admin1] = await ethers.getSigners();

    // Deploy VibeCasterPoints
    const VibeCasterPoints = await ethers.getContractFactory("VibeCasterPoints");
    pointsContract = await VibeCasterPoints.deploy(owner.address);

    // Deploy VibeCasterBadges
    const VibeCasterBadges = await ethers.getContractFactory("VibeCasterBadges");
    badgesContract = await VibeCasterBadges.deploy(
      owner.address,
      "VibeCaster Badges",
      "VCB",
      "https://ipfs.io/ipfs/"
    );

    // Deploy RoastMeContract
    const RoastMeContract = await ethers.getContractFactory("RoastMeContract");
    roastContract = await RoastMeContract.deploy(
      owner.address,
      await pointsContract.getAddress(),
      await badgesContract.getAddress()
    );

    // Deploy IcebreakerContract
    const IcebreakerContract = await ethers.getContractFactory("IcebreakerContract");
    icebreakerContract = await IcebreakerContract.deploy(
      owner.address,
      await pointsContract.getAddress(),
      await badgesContract.getAddress()
    );

    // Deploy ChainReactionContract
    const ChainReactionContract = await ethers.getContractFactory("ChainReactionContract");
    chainReactionContract = await ChainReactionContract.deploy(
      owner.address,
      await pointsContract.getAddress(),
      await badgesContract.getAddress()
    );

    // Deploy VibeCasterAdmin
    const VibeCasterAdmin = await ethers.getContractFactory("VibeCasterAdmin");
    adminContract = await VibeCasterAdmin.deploy(owner.address);

    // Set contracts in admin
    await adminContract.setContracts(
      await pointsContract.getAddress(),
      await badgesContract.getAddress(),
      await roastContract.getAddress(),
      await icebreakerContract.getAddress(),
      await chainReactionContract.getAddress()
    );

    // Authorize contracts
    await pointsContract.authorizeContract(await roastContract.getAddress());
    await pointsContract.authorizeContract(await icebreakerContract.getAddress());
    await pointsContract.authorizeContract(await chainReactionContract.getAddress());
    await pointsContract.authorizeContract(await adminContract.getAddress());

    // Authorize minters
    await badgesContract.authorizeMinter(await roastContract.getAddress());
    await badgesContract.authorizeMinter(await icebreakerContract.getAddress());
    await badgesContract.authorizeMinter(await chainReactionContract.getAddress());
    await badgesContract.authorizeMinter(await adminContract.getAddress());

    // Authorize admin in all contracts
    await adminContract.authorizeAdmin(admin1.address);
    
    // Transfer ownership of contracts to admin contract for admin functions
    await roastContract.transferOwnership(await adminContract.getAddress());
    await icebreakerContract.transferOwnership(await adminContract.getAddress());
    await chainReactionContract.transferOwnership(await adminContract.getAddress());
  });

  describe("VibeCasterPoints", function () {
    it("Should award points correctly", async function () {
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      expect(await pointsContract.getPoints(user1.address)).to.equal(10);
    });

    it("Should deduct points correctly", async function () {
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      await pointsContract.connect(owner).deductPoints(user1.address, 5, "Test deduction");
      expect(await pointsContract.getPoints(user1.address)).to.equal(5);
    });

    it("Should only allow authorized contracts to award points", async function () {
      await expect(
        pointsContract.connect(user1).earnPoints(user1.address, 10, "Test")
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("VibeCasterBadges", function () {
    it("Should mint badges correctly", async function () {
      await badgesContract.connect(owner).mintBadge(user1.address, "First Roast", "ipfs://QmHash");
      expect(await badgesContract.balanceOf(user1.address)).to.equal(1);
    });

    it("Should only allow authorized minters", async function () {
      await expect(
        badgesContract.connect(user1).mintBadge(user1.address, "Test Badge", "ipfs://QmHash")
      ).to.be.revertedWith("Not authorized minter");
    });

    it("Should make badges non-transferable", async function () {
      await badgesContract.connect(owner).mintBadge(user1.address, "Test Badge", "ipfs://QmHash");
      // Badges are non-transferable by design, so transfer should fail
      await expect(
        badgesContract.connect(user1).transfer(user2.address, 1)
      ).to.be.reverted;
    });
  });

  describe("RoastMeContract", function () {
    it("Should submit roasts correctly", async function () {
      const tx = await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      await expect(tx).to.emit(roastContract, "RoastSubmitted");
      
      const roast = await roastContract.getRoast(1);
      expect(roast.submitter).to.equal(user1.address);
      expect(roast.originalImageIpfsHash).to.equal("QmHash1");
      expect(roast.roastIpfsHash).to.equal("QmHash2");
    });

    it("Should handle voting correctly", async function () {
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      await roastContract.connect(user2).voteRoast(1, true);
      
      const roast = await roastContract.getRoast(1);
      expect(roast.funnyVotes).to.equal(1);
      expect(roast.mehVotes).to.equal(0);
    });

    it("Should prevent voting on own roast", async function () {
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      await expect(
        roastContract.connect(user1).voteRoast(1, true)
      ).to.be.revertedWith("Cannot vote on your own roast");
    });

    it("Should prevent double voting", async function () {
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      await roastContract.connect(user2).voteRoast(1, true);
      await expect(
        roastContract.connect(user2).voteRoast(1, false)
      ).to.be.revertedWith("Already voted on this roast");
    });
  });

  describe("IcebreakerContract", function () {
    it("Should create prompts correctly", async function () {
      const tx = await icebreakerContract.connect(owner).createPrompt("What's your favorite color?", "truth");
      await expect(tx).to.emit(icebreakerContract, "PromptCreated");
    });

    it("Should submit responses correctly", async function () {
      await icebreakerContract.connect(owner).createPrompt("What's your favorite color?", "truth");
      const tx = await icebreakerContract.connect(user1).submitResponse(1, "Blue", "");
      await expect(tx).to.emit(icebreakerContract, "ResponseSubmitted");
    });

    it("Should create polls correctly", async function () {
      const options = ["Option 1", "Option 2", "Option 3"];
      const tx = await icebreakerContract.connect(owner).createPoll("What's your favorite?", options);
      await expect(tx).to.emit(icebreakerContract, "PollCreated");
    });

    it("Should handle poll voting correctly", async function () {
      const options = ["Option 1", "Option 2", "Option 3"];
      await icebreakerContract.connect(owner).createPoll("What's your favorite?", options);
      await icebreakerContract.connect(user1).votePoll(1, 1);
      
      const poll = await icebreakerContract.getPoll(1);
      expect(poll.voteCounts[1]).to.equal(1);
      expect(poll.totalVotes).to.equal(1);
    });
  });

  describe("ChainReactionContract", function () {
    it("Should start challenges correctly", async function () {
      const tx = await chainReactionContract.connect(user1).startChallenge("Show your desk setup", "");
      await expect(tx).to.emit(chainReactionContract, "ChallengeStarted");
    });

    it("Should join challenges correctly", async function () {
      await chainReactionContract.connect(user1).startChallenge("Show your desk setup", "");
      const tx = await chainReactionContract.connect(user2).joinChallenge(1, 0, "Here's my desk!", "");
      await expect(tx).to.emit(chainReactionContract, "ChallengeJoined");
    });

    it("Should handle response chains correctly", async function () {
      await chainReactionContract.connect(user1).startChallenge("Show your desk setup", "");
      await chainReactionContract.connect(user2).joinChallenge(1, 0, "Here's my desk!", "");
      await chainReactionContract.connect(user3).joinChallenge(1, 1, "Nice desk!", "");
      
      const challenge = await chainReactionContract.getChallenge(1);
      expect(challenge.responseIds.length).to.equal(2);
    });
  });

  describe("VibeCasterAdmin", function () {
    it("Should allow authorized admins to award points", async function () {
      await adminContract.connect(admin1).awardPoints(user1.address, 100, "Test award");
      expect(await pointsContract.getPoints(user1.address)).to.equal(100);
    });

    it("Should allow authorized admins to deduct points", async function () {
      await adminContract.connect(admin1).awardPoints(user1.address, 100, "Test award");
      await adminContract.connect(admin1).deductPoints(user1.address, 50, "Test deduction");
      expect(await pointsContract.getPoints(user1.address)).to.equal(50);
    });

    it("Should allow authorized admins to mint badges", async function () {
      await adminContract.connect(admin1).mintBadge(user1.address, "Test Badge", "ipfs://QmHash");
      expect(await badgesContract.balanceOf(user1.address)).to.equal(1);
    });

    it("Should allow authorized admins to create icebreaker prompts", async function () {
      const tx = await adminContract.connect(admin1).createIcebreakerPrompt("Test prompt", "truth");
      await expect(tx).to.emit(adminContract, "PromptCreated");
    });

    it("Should allow authorized admins to create polls", async function () {
      const options = ["Option 1", "Option 2"];
      const tx = await adminContract.connect(admin1).createIcebreakerPoll("Test poll", options);
      await expect(tx).to.emit(adminContract, "PollCreated");
    });

    it("Should allow authorized admins to update points", async function () {
      await adminContract.connect(admin1).updateRoastMePoints(20, 2, 10);
      expect(await roastContract.pointsPerRoast()).to.equal(20);
      expect(await roastContract.pointsPerVote()).to.equal(2);
      expect(await roastContract.pointsPerFunnyVote()).to.equal(10);
    });

    it("Should prevent unauthorized users from admin functions", async function () {
      await expect(
        adminContract.connect(user1).awardPoints(user2.address, 100, "Test")
      ).to.be.revertedWith("Not authorized");
    });

    it("Should provide correct stats", async function () {
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      expect(await adminContract.getRoastMeStats()).to.equal(1);
    });

    it("Should check admin authorization correctly", async function () {
      expect(await adminContract.isAuthorizedAdmin(admin1.address)).to.be.true;
      expect(await adminContract.isAuthorizedAdmin(user1.address)).to.be.false;
    });
  });

  describe("Integration Tests", function () {
    it("Should award points for roast submission and voting", async function () {
      // User1 submits a roast
      await roastContract.connect(user1).submitRoast("QmHash1", "QmHash2");
      expect(await pointsContract.getPoints(user1.address)).to.equal(10);

      // User2 votes funny
      await roastContract.connect(user2).voteRoast(1, true);
      expect(await pointsContract.getPoints(user2.address)).to.equal(1);
      expect(await pointsContract.getPoints(user1.address)).to.equal(15); // 10 + 5 bonus
    });

    it("Should award points for icebreaker responses", async function () {
      await icebreakerContract.connect(owner).createPrompt("What's your favorite color?", "truth");
      await icebreakerContract.connect(user1).submitResponse(1, "Blue", "");
      expect(await pointsContract.getPoints(user1.address)).to.equal(5);
    });

    it("Should award points for chain reaction participation", async function () {
      await chainReactionContract.connect(user1).startChallenge("Show your desk setup", "");
      expect(await pointsContract.getPoints(user1.address)).to.equal(15);

      await chainReactionContract.connect(user2).joinChallenge(1, 0, "Here's my desk!", "");
      expect(await pointsContract.getPoints(user2.address)).to.equal(10);
    });

    it("Should allow admin to manage the entire ecosystem", async function () {
      // Admin awards points
      await adminContract.connect(admin1).awardPoints(user1.address, 100, "Admin award");
      expect(await pointsContract.getPoints(user1.address)).to.equal(100);

      // Admin mints badge
      await adminContract.connect(admin1).mintBadge(user1.address, "Admin Badge", "ipfs://QmHash");
      expect(await badgesContract.balanceOf(user1.address)).to.equal(1);

      // Admin creates prompt
      await adminContract.connect(admin1).createIcebreakerPrompt("Admin prompt", "truth");
      expect(await icebreakerContract.totalPrompts()).to.equal(1);
    });
  });
});
