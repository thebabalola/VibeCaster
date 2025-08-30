"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState, useEffect } from "react";
import { FaCrown, FaUsers, FaChartLine, FaCog, FaLock, FaBolt, FaFire, FaSnowflake, FaGem, FaTrophy, FaSync, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Import ABIs
import VibeCasterAdminArtifact from "../../abis/VibeCasterAdmin.json";
import VibeCasterPointsArtifact from "../../abis/VibeCasterPoints.json";
import VibeCasterBadgesArtifact from "../../abis/VibeCasterBadges.json";
import RoastMeContractArtifact from "../../abis/RoastMeContract.json";
import IcebreakerContractArtifact from "../../abis/IcebreakerContract.json";
import ChainReactionContractArtifact from "../../abis/ChainReactionContract.json";

// Extract ABIs from artifacts
const VibeCasterAdminABI = VibeCasterAdminArtifact.abi;
const VibeCasterPointsABI = VibeCasterPointsArtifact.abi;
const VibeCasterBadgesABI = VibeCasterBadgesArtifact.abi;
const RoastMeContractABI = RoastMeContractArtifact.abi;
const IcebreakerContractABI = IcebreakerContractArtifact.abi;
const ChainReactionContractABI = ChainReactionContractArtifact.abi;

// Contract addresses (update with actual deployed addresses)
const VIBECASTER_ADMIN_ADDRESS = "0xfB462A2f915d45BE8292B8e81ca4bbe7d1072b50";
const VIBECASTER_POINTS_ADDRESS = "0xEe832dc966BC8D66742aA0c01bC7797116839634";
const VIBECASTER_BADGES_ADDRESS = "0x5820440e686A5519ca5Eb1c6148C54d77DE23115";
const ROAST_ME_CONTRACT_ADDRESS = "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0";
const ICEBREAKER_CONTRACT_ADDRESS = "0x7CecE53Ea570457C885fE09C39E82D1cD8A0da6B";
const CHAIN_REACTION_CONTRACT_ADDRESS = "0x3A8F031e2A4040E8D599b8dbAB09B4f6251a07B9";

// IPFS Upload Function (similar to MintMyMood)
async function uploadBadgeToIPFS(
  image: File,
  badgeName: string,
  badgeDescription: string,
  badgeType: string,
  rarity: string,
  externalUrl: string = "https://vibecaster.xyz"
) {
  try {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error("Pinata JWT missing - please set NEXT_PUBLIC_PINATA_JWT");
    }

    const { PinataSDK } = await import("pinata");
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
    });

    console.log("Uploading badge image to Pinata...");

    // Upload image
    const imageUpload = await pinata.upload.public.file(image);
    console.log("Image uploaded:", imageUpload);

    const imageUri = `ipfs://${imageUpload.cid}`;

    // Create metadata
    const metadata = {
      name: badgeName,
      description: badgeDescription,
      image: imageUri,
      external_url: externalUrl,
      attributes: [
        { trait_type: "Badge Type", value: badgeType },
        { trait_type: "Rarity", value: rarity },
      ],
    };

    console.log("Uploading metadata to Pinata...");

    // Upload metadata
    const metadataUpload = await pinata.upload.public.json(metadata);
    console.log("Metadata uploaded:", metadataUpload);

    return `ipfs://${metadataUpload.cid}`;
  } catch (error) {
    console.error("Pinata upload failed:", error);
    throw error;
  }
}

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoasts: 0,
    totalChains: 0,
    totalPoints: 0,
    totalBadges: 0,
    totalIcebreakers: 0
  });

  // Contract interactions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Check if current user is admin
  const { data: isAuthorizedAdmin } = useReadContract({
    address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
    abi: VibeCasterAdminABI,
    functionName: "isAuthorizedAdmin",
    args: address ? [address] : undefined,
  });

  // Get platform stats - only call when admin is authorized
  const { data: roastStats } = useReadContract({
    address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
    abi: VibeCasterAdminABI,
    functionName: "getRoastMeStats",
  });

  const { data: icebreakerStats } = useReadContract({
    address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
    abi: VibeCasterAdminABI,
    functionName: "getIcebreakerStats",
  });

  const { data: chainStats } = useReadContract({
    address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
    abi: VibeCasterAdminABI,
    functionName: "getChainReactionStats",
  });

  // Points management form state
  const [pointsForm, setPointsForm] = useState({
    roastPoints: 10,
    roastVotePoints: 5,
    roastFunnyPoints: 15,
    icebreakerPromptPoints: 20,
    icebreakerResponsePoints: 10,
    icebreakerVotePoints: 5,
    chainChallengePoints: 25,
    chainResponsePoints: 15,
    dailyLoginPoints: 5,
    streakBonusPoints: 10,
    activityStreakBonus: 20
  });

  // Badge management form state
  const [badgeForm, setBadgeForm] = useState({
    firstActivityRequirement: 1,
    loginStreakRequirement: 7,
    activityStreakRequirement: 5,
    topRoasterRequirement: 10,
    chainMasterRequirement: 5,
    icebreakerRequirement: 3
  });

  // Badge upload state
  const [badgeUpload, setBadgeUpload] = useState({
    badgeName: "",
    badgeDescription: "",
    badgeType: "",
    rarity: "Common",
    imageFile: null as File | null,
    imagePreview: "",
    isUploading: false,
    uploadProgress: ""
  });

  // Admin management state
  const [adminManagement, setAdminManagement] = useState({
    newAdminAddress: "",
    contractToAuthorize: "",
    minterToAuthorize: "",
    userAddress: "",
    pointsToAward: 0,
    pointsToDeduct: 0,
    reason: ""
  });

  // Badge URI management state
  const [badgeURIs, setBadgeURIs] = useState({
    firstActivityBadgeURI: "",
    loginStreakBadgeURI: "",
    activityStreakBadgeURI: "",
    topRoasterBadgeURI: "",
    chainMasterBadgeURI: "",
    icebreakerBadgeURI: "",
    baseURI: ""
  });

  // Category management
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    if (isAuthorizedAdmin !== undefined) {
      setIsAdmin(Boolean(isAuthorizedAdmin));
      setIsLoading(false);
    }
  }, [isAuthorizedAdmin]);

  useEffect(() => {
    if (roastStats && icebreakerStats && chainStats) {
      setStats({
        totalUsers: 0, // Would need to implement user counting
        totalRoasts: Number(roastStats) || 0,
        totalChains: Array.isArray(chainStats) ? Number(chainStats[0]) || 0 : 0,
        totalPoints: 0, // Would need to implement total points calculation
        totalBadges: 0, // Would need to implement badge counting
        totalIcebreakers: Array.isArray(icebreakerStats) ? Number(icebreakerStats[1]) || 0 : 0
      });
    }
  }, [roastStats, icebreakerStats, chainStats]);

  // Admin functions
  const updateRoastMePoints = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "updateRoastMePoints",
      args: [pointsForm.roastPoints, pointsForm.roastVotePoints, pointsForm.roastFunnyPoints]
    });
  };

  const updateIcebreakerPoints = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "updateIcebreakerPoints",
      args: [pointsForm.icebreakerPromptPoints, pointsForm.icebreakerResponsePoints, pointsForm.icebreakerVotePoints]
    });
  };

  const updateChainReactionPoints = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "updateChainReactionPoints",
      args: [pointsForm.chainChallengePoints, pointsForm.chainResponsePoints]
    });
  };

  const updateDailyLoginPoints = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "updateDailyLoginPoints",
      args: [pointsForm.dailyLoginPoints, pointsForm.streakBonusPoints, pointsForm.activityStreakBonus]
    });
  };

  const createIcebreakerCategory = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "createIcebreakerCategory",
      args: [newCategory.name, newCategory.description]
    });
  };

  const updateBadgeRequirements = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "setBadgeRequirements",
      args: [
        badgeForm.firstActivityRequirement,
        badgeForm.loginStreakRequirement,
        badgeForm.activityStreakRequirement,
        badgeForm.topRoasterRequirement,
        badgeForm.chainMasterRequirement,
        badgeForm.icebreakerRequirement
      ]
    });
  };

  // Badge upload functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBadgeUpload(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleBadgeUpload = async () => {
    if (!badgeUpload.imageFile || !badgeUpload.badgeName || !badgeUpload.badgeDescription || !badgeUpload.badgeType) {
      alert("Please fill in all fields and select an image");
      return;
    }

    setBadgeUpload(prev => ({ ...prev, isUploading: true, uploadProgress: "Uploading badge to IPFS..." }));

    try {
      const metadataUri = await uploadBadgeToIPFS(
        badgeUpload.imageFile,
        badgeUpload.badgeName,
        badgeUpload.badgeDescription,
        badgeUpload.badgeType,
        badgeUpload.rarity
      );

      setBadgeUpload(prev => ({ ...prev, uploadProgress: "Badge uploaded successfully! Metadata URI: " + metadataUri }));

      // Reset form
      setTimeout(() => {
        setBadgeUpload({
          badgeName: "",
          badgeDescription: "",
          badgeType: "",
          rarity: "Common",
          imageFile: null,
          imagePreview: "",
          isUploading: false,
          uploadProgress: ""
        });
      }, 3000);

    } catch (error) {
      console.error("Badge upload failed:", error);
      setBadgeUpload(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    }
  };

  const clearBadgeUpload = () => {
    setBadgeUpload({
      badgeName: "",
      badgeDescription: "",
      badgeType: "",
      rarity: "Common",
      imageFile: null,
      imagePreview: "",
      isUploading: false,
      uploadProgress: ""
    });
  };

  // Admin Management Functions
  const authorizeAdmin = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "authorizeAdmin",
      args: [adminManagement.newAdminAddress]
    });
  };

  const deauthorizeAdmin = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "deauthorizeAdmin",
      args: [adminManagement.newAdminAddress]
    });
  };

  // Contract Authorization Functions
  const authorizeContract = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "authorizeContractInPoints",
      args: [adminManagement.contractToAuthorize]
    });
  };

  const deauthorizeContract = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "deauthorizeContractInPoints",
      args: [adminManagement.contractToAuthorize]
    });
  };

  // Badge Minter Authorization Functions
  const authorizeMinter = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "authorizeMinterInBadges",
      args: [adminManagement.minterToAuthorize]
    });
  };

  const deauthorizeMinter = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "deauthorizeMinterInBadges",
      args: [adminManagement.minterToAuthorize]
    });
  };

  // Badge URI Management Functions
  const updateBadgeURIs = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "setBadgeURIs",
      args: [
        badgeURIs.firstActivityBadgeURI,
        badgeURIs.loginStreakBadgeURI,
        badgeURIs.activityStreakBadgeURI,
        badgeURIs.topRoasterBadgeURI,
        badgeURIs.chainMasterBadgeURI,
        badgeURIs.icebreakerBadgeURI
      ]
    });
  };

  const updateBadgeBaseURI = () => {
    writeContract({
      address: VIBECASTER_ADMIN_ADDRESS as `0x${string}`,
      abi: VibeCasterAdminABI,
      functionName: "setBadgeBaseURI",
      args: [badgeURIs.baseURI]
    });
  };

  // User Points Management Functions
  const awardPoints = () => {
    writeContract({
      address: VIBECASTER_POINTS_ADDRESS as `0x${string}`,
      abi: VibeCasterPointsABI,
      functionName: "earnPoints",
      args: [adminManagement.userAddress, adminManagement.pointsToAward, adminManagement.reason]
    });
  };

  const deductPoints = () => {
    writeContract({
      address: VIBECASTER_POINTS_ADDRESS as `0x${string}`,
      abi: VibeCasterPointsABI,
      functionName: "deductPoints",
      args: [adminManagement.userAddress, adminManagement.pointsToDeduct, adminManagement.reason]
    });
  };

  // Clear admin management form after successful transaction
  useEffect(() => {
    if (isSuccess) {
      setAdminManagement({
        newAdminAddress: "",
        contractToAuthorize: "",
        minterToAuthorize: "",
        userAddress: "",
        pointsToAward: 0,
        pointsToDeduct: 0,
        reason: ""
      });
    }
  }, [isSuccess]);

  const tabs = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "points", label: "Points Management", icon: FaBolt },
    { id: "badges", label: "Badge Management", icon: FaTrophy },
    { id: "badgeUpload", label: "Badge Upload", icon: FaPlus },
    { id: "categories", label: "Categories", icon: FaCog },
    { id: "adminManagement", label: "Admin Management", icon: FaCrown },
    { id: "users", label: "User Management", icon: FaUsers },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="vibecaster-card p-4 text-center">
                <FaUsers size={24} className="text-vibecaster-lavender mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalUsers}</div>
                <div className="text-xs text-vibecaster-pink-light">Total Users</div>
              </div>
              
              <div className="vibecaster-card p-4 text-center">
                <FaFire size={24} className="text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalRoasts}</div>
                <div className="text-xs text-vibecaster-pink-light">Total Roasts</div>
              </div>
              
              <div className="vibecaster-card p-4 text-center">
                <FaBolt size={24} className="text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalChains}</div>
                <div className="text-xs text-vibecaster-pink-light">Viral Chains</div>
              </div>
              
              <div className="vibecaster-card p-4 text-center">
                <FaSnowflake size={24} className="text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalIcebreakers}</div>
                <div className="text-xs text-vibecaster-pink-light">Icebreakers</div>
              </div>
              
              <div className="vibecaster-card p-4 text-center">
                <FaGem size={24} className="text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalPoints}</div>
                <div className="text-xs text-vibecaster-pink-light">Points Awarded</div>
              </div>
              
              <div className="vibecaster-card p-4 text-center">
                <FaTrophy size={24} className="text-yellow-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalBadges}</div>
                <div className="text-xs text-vibecaster-pink-light">Badges Minted</div>
              </div>
            </div>

            {/* System Status */}
            <div className="vibecaster-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <span className="text-white">Smart Contracts</span>
                  <span className="text-green-400">✓ Online</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <span className="text-white">IPFS Storage</span>
                  <span className="text-green-400">✓ Online</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <span className="text-white">AI Services</span>
                  <span className="text-green-400">✓ Online</span>
                </div>
              </div>
            </div>
          </>
        );

      case "points":
        return (
          <div className="space-y-6">
            {/* RoastMe Points */}
            <div className="vibecaster-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaFire className="text-red-400" />
                RoastMe Points Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Roast</label>
                  <input
                    type="number"
                    value={pointsForm.roastPoints}
                    onChange={(e) => setPointsForm({...pointsForm, roastPoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Vote</label>
                  <input
                    type="number"
                    value={pointsForm.roastVotePoints}
                    onChange={(e) => setPointsForm({...pointsForm, roastVotePoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Funny Vote</label>
                  <input
                    type="number"
                    value={pointsForm.roastFunnyPoints}
                    onChange={(e) => setPointsForm({...pointsForm, roastFunnyPoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={updateRoastMePoints}
                disabled={isPending}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update RoastMe Points"}
              </button>
            </div>

            {/* Icebreaker Points */}
            <div className="vibecaster-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaSnowflake className="text-blue-400" />
                Icebreaker Points Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Prompt</label>
                  <input
                    type="number"
                    value={pointsForm.icebreakerPromptPoints}
                    onChange={(e) => setPointsForm({...pointsForm, icebreakerPromptPoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Response</label>
                  <input
                    type="number"
                    value={pointsForm.icebreakerResponsePoints}
                    onChange={(e) => setPointsForm({...pointsForm, icebreakerResponsePoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Vote</label>
                  <input
                    type="number"
                    value={pointsForm.icebreakerVotePoints}
                    onChange={(e) => setPointsForm({...pointsForm, icebreakerVotePoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={updateIcebreakerPoints}
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update Icebreaker Points"}
              </button>
            </div>

            {/* Chain Reaction Points */}
            <div className="vibecaster-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaBolt className="text-yellow-400" />
                Chain Reaction Points Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Challenge</label>
                  <input
                    type="number"
                    value={pointsForm.chainChallengePoints}
                    onChange={(e) => setPointsForm({...pointsForm, chainChallengePoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points per Response</label>
                  <input
                    type="number"
                    value={pointsForm.chainResponsePoints}
                    onChange={(e) => setPointsForm({...pointsForm, chainResponsePoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={updateChainReactionPoints}
                disabled={isPending}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update Chain Reaction Points"}
              </button>
            </div>

            {/* Daily Login Points */}
            <div className="vibecaster-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaGem className="text-purple-400" />
                Daily Login Points Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Daily Login Points</label>
                  <input
                    type="number"
                    value={pointsForm.dailyLoginPoints}
                    onChange={(e) => setPointsForm({...pointsForm, dailyLoginPoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Streak Bonus Points</label>
                  <input
                    type="number"
                    value={pointsForm.streakBonusPoints}
                    onChange={(e) => setPointsForm({...pointsForm, streakBonusPoints: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Activity Streak Bonus</label>
                  <input
                    type="number"
                    value={pointsForm.activityStreakBonus}
                    onChange={(e) => setPointsForm({...pointsForm, activityStreakBonus: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={updateDailyLoginPoints}
                disabled={isPending}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update Daily Login Points"}
              </button>
            </div>
          </div>
        );

      case "badges":
        return (
          <div className="vibecaster-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-400" />
              Badge Management
            </h3>
            
            {/* Badge Requirements */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-white mb-4">Badge Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">First Activity Requirement</label>
                  <input
                    type="number"
                    value={badgeForm.firstActivityRequirement}
                    onChange={(e) => setBadgeForm({...badgeForm, firstActivityRequirement: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Login Streak Requirement</label>
                  <input
                    type="number"
                    value={badgeForm.loginStreakRequirement}
                    onChange={(e) => setBadgeForm({...badgeForm, loginStreakRequirement: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Activity Streak Requirement</label>
                  <input
                    type="number"
                    value={badgeForm.activityStreakRequirement}
                    onChange={(e) => setBadgeForm({...badgeForm, activityStreakRequirement: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Top Roaster Requirement</label>
                  <input
                    type="number"
                    value={badgeForm.topRoasterRequirement}
                    onChange={(e) => setBadgeForm({...badgeForm, topRoasterRequirement: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Chain Master Requirement</label>
                  <input
                    type="number"
                    value={badgeForm.chainMasterRequirement}
                    onChange={(e) => setBadgeForm({...badgeForm, chainMasterRequirement: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Icebreaker Requirement</label>
                  <input
                    type="number"
                    value={badgeForm.icebreakerRequirement}
                    onChange={(e) => setBadgeForm({...badgeForm, icebreakerRequirement: Number(e.target.value)})}
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={updateBadgeRequirements}
                disabled={isPending}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update Badge Requirements"}
              </button>
            </div>

            {/* Badge URIs */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-white mb-4">Badge URIs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">First Activity Badge URI</label>
                  <input
                    type="text"
                    value={badgeURIs.firstActivityBadgeURI}
                    onChange={(e) => setBadgeURIs({...badgeURIs, firstActivityBadgeURI: e.target.value})}
                    placeholder="ipfs://..."
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Login Streak Badge URI</label>
                  <input
                    type="text"
                    value={badgeURIs.loginStreakBadgeURI}
                    onChange={(e) => setBadgeURIs({...badgeURIs, loginStreakBadgeURI: e.target.value})}
                    placeholder="ipfs://..."
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Activity Streak Badge URI</label>
                  <input
                    type="text"
                    value={badgeURIs.activityStreakBadgeURI}
                    onChange={(e) => setBadgeURIs({...badgeURIs, activityStreakBadgeURI: e.target.value})}
                    placeholder="ipfs://..."
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Top Roaster Badge URI</label>
                  <input
                    type="text"
                    value={badgeURIs.topRoasterBadgeURI}
                    onChange={(e) => setBadgeURIs({...badgeURIs, topRoasterBadgeURI: e.target.value})}
                    placeholder="ipfs://..."
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Chain Master Badge URI</label>
                  <input
                    type="text"
                    value={badgeURIs.chainMasterBadgeURI}
                    onChange={(e) => setBadgeURIs({...badgeURIs, chainMasterBadgeURI: e.target.value})}
                    placeholder="ipfs://..."
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Icebreaker Badge URI</label>
                  <input
                    type="text"
                    value={badgeURIs.icebreakerBadgeURI}
                    onChange={(e) => setBadgeURIs({...badgeURIs, icebreakerBadgeURI: e.target.value})}
                    placeholder="ipfs://..."
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={updateBadgeURIs}
                disabled={isPending}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update Badge URIs"}
              </button>
            </div>

            {/* Badge Base URI */}
            <div>
              <h4 className="text-md font-semibold text-white mb-4">Badge Base URI</h4>
              <div className="mb-4">
                <label className="block text-sm text-vibecaster-pink-light mb-1">Base URI</label>
                <input
                  type="text"
                  value={badgeURIs.baseURI}
                  onChange={(e) => setBadgeURIs({...badgeURIs, baseURI: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <button
                onClick={updateBadgeBaseURI}
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPending ? "Updating..." : "Update Base URI"}
              </button>
            </div>
          </div>
        );

      case "badgeUpload":
        return (
          <div className="vibecaster-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaPlus className="text-green-400" />
              Upload New Badge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-vibecaster-pink-light mb-1">Badge Name</label>
                <input
                  type="text"
                  value={badgeUpload.badgeName}
                  onChange={(e) => setBadgeUpload({...badgeUpload, badgeName: e.target.value})}
                  placeholder="Enter badge name"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-vibecaster-pink-light mb-1">Badge Description</label>
                <input
                  type="text"
                  value={badgeUpload.badgeDescription}
                  onChange={(e) => setBadgeUpload({...badgeUpload, badgeDescription: e.target.value})}
                  placeholder="Enter badge description"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-vibecaster-pink-light mb-1">Badge Type</label>
                <input
                  type="text"
                  value={badgeUpload.badgeType}
                  onChange={(e) => setBadgeUpload({...badgeUpload, badgeType: e.target.value})}
                  placeholder="Enter badge type (e.g., 'Roast', 'Icebreaker', 'Chain')"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-vibecaster-pink-light mb-1">Rarity</label>
                <select
                  value={badgeUpload.rarity}
                  onChange={(e) => setBadgeUpload({...badgeUpload, rarity: e.target.value})}
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-vibecaster-pink-light mb-1">Badge Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-vibecaster-pink-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vibecaster-lavender file:text-white hover:file:bg-vibecaster-lavender/20"
              />
              {badgeUpload.imagePreview && (
                <div className="mt-4">
                  <img src={badgeUpload.imagePreview} alt="Badge Preview" className="max-w-sm h-auto rounded-lg" />
                </div>
              )}
            </div>
            <button
              onClick={handleBadgeUpload}
              disabled={isPending || !badgeUpload.imageFile || !badgeUpload.badgeName || !badgeUpload.badgeDescription || !badgeUpload.badgeType}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isPending ? "Uploading..." : "Upload Badge"}
            </button>
            {badgeUpload.isUploading && (
              <div className="mt-4 text-vibecaster-pink-light">
                {badgeUpload.uploadProgress}
              </div>
            )}
            {badgeUpload.uploadProgress && !badgeUpload.isUploading && (
              <div className="mt-4 text-green-400">
                {badgeUpload.uploadProgress}
              </div>
            )}
            {badgeUpload.uploadProgress && !badgeUpload.isUploading && (
              <button
                onClick={clearBadgeUpload}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Upload
              </button>
            )}
          </div>
        );

      case "adminManagement":
        return (
          <div className="vibecaster-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaCrown className="text-vibecaster-lavender" />
              Admin Management
            </h3>
            
            {/* Admin Authorization */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-white mb-4">Admin Authorization</h4>
              <div className="mb-4">
                <label className="block text-sm text-vibecaster-pink-light mb-1">New Admin Address</label>
                <input
                  type="text"
                  value={adminManagement.newAdminAddress}
                  onChange={(e) => setAdminManagement({...adminManagement, newAdminAddress: e.target.value})}
                  placeholder="Enter new admin address"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={authorizeAdmin}
                    disabled={isPending || !adminManagement.newAdminAddress}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Authorizing..." : "Authorize Admin"}
                  </button>
                  <button
                    onClick={deauthorizeAdmin}
                    disabled={isPending || !adminManagement.newAdminAddress}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Deauthorizing..." : "Deauthorize Admin"}
                  </button>
                </div>
              </div>
            </div>

            {/* Contract Authorization */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-white mb-4">Contract Authorization</h4>
              <div className="mb-4">
                <label className="block text-sm text-vibecaster-pink-light mb-1">Contract to Authorize</label>
                <input
                  type="text"
                  value={adminManagement.contractToAuthorize}
                  onChange={(e) => setAdminManagement({...adminManagement, contractToAuthorize: e.target.value})}
                  placeholder="Enter contract address to authorize"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={authorizeContract}
                    disabled={isPending || !adminManagement.contractToAuthorize}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Authorizing Contract..." : "Authorize Contract"}
                  </button>
                  <button
                    onClick={deauthorizeContract}
                    disabled={isPending || !adminManagement.contractToAuthorize}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Deauthorizing Contract..." : "Deauthorize Contract"}
                  </button>
                </div>
              </div>
            </div>

            {/* Minter Authorization */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-white mb-4">Minter Authorization</h4>
              <div className="mb-4">
                <label className="block text-sm text-vibecaster-pink-light mb-1">Minter to Authorize</label>
                <input
                  type="text"
                  value={adminManagement.minterToAuthorize}
                  onChange={(e) => setAdminManagement({...adminManagement, minterToAuthorize: e.target.value})}
                  placeholder="Enter minter address to authorize"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={authorizeMinter}
                    disabled={isPending || !adminManagement.minterToAuthorize}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Authorizing Minter..." : "Authorize Minter"}
                  </button>
                  <button
                    onClick={deauthorizeMinter}
                    disabled={isPending || !adminManagement.minterToAuthorize}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Deauthorizing Minter..." : "Deauthorize Minter"}
                  </button>
                </div>
              </div>
            </div>

            {/* User Points Management */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-white mb-4">User Points Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">User Address</label>
                  <input
                    type="text"
                    value={adminManagement.userAddress}
                    onChange={(e) => setAdminManagement({...adminManagement, userAddress: e.target.value})}
                    placeholder="Enter user address for points"
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Reason</label>
                  <input
                    type="text"
                    value={adminManagement.reason}
                    onChange={(e) => setAdminManagement({...adminManagement, reason: e.target.value})}
                    placeholder="Enter reason for points"
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points to Award</label>
                  <input
                    type="number"
                    value={adminManagement.pointsToAward}
                    onChange={(e) => setAdminManagement({...adminManagement, pointsToAward: Number(e.target.value)})}
                    placeholder="Enter points to award"
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white mb-2"
                  />
                  <button
                    onClick={awardPoints}
                    disabled={isPending || !adminManagement.userAddress || adminManagement.pointsToAward === 0}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Awarding Points..." : "Award Points"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-vibecaster-pink-light mb-1">Points to Deduct</label>
                  <input
                    type="number"
                    value={adminManagement.pointsToDeduct}
                    onChange={(e) => setAdminManagement({...adminManagement, pointsToDeduct: Number(e.target.value)})}
                    placeholder="Enter points to deduct"
                    className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white mb-2"
                  />
                  <button
                    onClick={deductPoints}
                    disabled={isPending || !adminManagement.userAddress || adminManagement.pointsToDeduct === 0}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPending ? "Deducting Points..." : "Deduct Points"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="vibecaster-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaPlus className="text-green-400" />
              Create New Icebreaker Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-vibecaster-pink-light mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-vibecaster-pink-light mb-1">Description</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Enter category description"
                  className="w-full bg-vibecaster-purple-dark/20 border border-vibecaster-lavender/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <button
              onClick={createIcebreakerCategory}
              disabled={isPending || !newCategory.name || !newCategory.description}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isPending ? "Creating..." : "Create Category"}
            </button>
          </div>
        );

      case "users":
        return (
          <div className="vibecaster-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">User Management</h3>
            <p className="text-vibecaster-pink-light">User management features coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen vibecaster-bg flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="text-white">Loading...</div>
          </div>
        ) : !isConnected ? (
          <div className="text-center">
            <FaLock size={64} className="text-vibecaster-lavender mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
            <p className="text-vibecaster-pink-light">Please connect your wallet to access admin features.</p>
          </div>
        ) : !isAdmin ? (
          <div className="text-center">
            <FaCrown size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
            <p className="text-vibecaster-pink-light mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-white/60">
              Address: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        ) : (
          <main className="container mx-auto px-4 py-8 w-full">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4 md:gap-0">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
                  <FaCrown className="inline text-vibecaster-lavender mr-2 md:mr-3" />
                  VibeCaster Admin
                </h1>
                <p className="text-xs md:text-sm text-vibecaster-pink-light">
                  Platform management and analytics
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs md:text-sm text-vibecaster-pink-light">Admin Access</p>
                <p className="text-xs text-white/60 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 md:gap-2 mb-6 md:mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 border ${
                      isActive
                        ? "bg-vibecaster-lavender text-white shadow-lg shadow-vibecaster-lavender/25 border-vibecaster-lavender"
                        : "text-white hover:bg-vibecaster-lavender/20 hover:shadow-md border-vibecaster-lavender/20"
                    }`}
                  >
                    <Icon size={14} className="md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Transaction Status */}
            {(isPending || isConfirming) && (
              <div className="vibecaster-card p-4 mb-6 bg-yellow-500/20 border border-yellow-500/30">
                <div className="flex items-center gap-3">
                  <FaSync className="text-yellow-400 animate-spin" />
                  <span className="text-white">
                    {isPending ? "Waiting for transaction..." : "Confirming transaction..."}
                  </span>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="vibecaster-card p-4 mb-6 bg-green-500/20 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-white">Transaction successful!</span>
                </div>
              </div>
            )}

            {/* Main Content */}
            {renderContent()}
          </main>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
