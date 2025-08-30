"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { FaCamera, FaUpload, FaFire, FaSpinner, FaTimes, FaCheckCircle, FaImage, FaHeart, FaThumbsDown, FaEye, FaShare, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import RoastMeContractArtifact from "../abis/RoastMeContract.json";

import { uploadRoastToIPFS } from "../lib/ipfs";

const RoastMeContractABI = RoastMeContractArtifact.abi;
const ROAST_ME_CONTRACT_ADDRESS = "0x15978cDBe7cc4238825647b1A61d6efA9371D5C0";

export default function RoastMe() {
  const { address, isConnected } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [roastResult, setRoastResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRoasting, setIsRoasting] = useState(false);
  const [error, setError] = useState<string>("");
  const [roastHistory, setRoastHistory] = useState<Array<{
    id: string;
    image: string;
    roast: string;
    timestamp: Date;
    funnyVotes: number;
    mehVotes: number;
    hasVoted: boolean;
    userVote: boolean | null;
  }>>([]);
  const [totalRoasts, setTotalRoasts] = useState<number>(0);
  const [userRoastCount, setUserRoastCount] = useState<number>(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Contract write functions
  const { writeContract: submitRoast, data: submitHash, isPending: isSubmitting } = useWriteContract();
  const { writeContract: voteRoast, data: voteHash, isPending: isVoting } = useWriteContract();

  // Contract read functions
  const { data: totalRoastsData } = useReadContract({
    address: ROAST_ME_CONTRACT_ADDRESS,
    abi: RoastMeContractABI,
    functionName: "totalRoasts",
  });

  const { data: userRoastsData } = useReadContract({
    address: ROAST_ME_CONTRACT_ADDRESS,
    abi: RoastMeContractABI,
    functionName: "getUserRoasts",
    args: address ? [address] : undefined,
  });

  // Wait for transactions
  const { isLoading: isConfirmingSubmit, isSuccess: isSubmitSuccess } = useWaitForTransactionReceipt({ hash: submitHash });
  const { isLoading: isConfirmingVote, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({ hash: voteHash });

  // Update total roasts
  useEffect(() => {
    if (totalRoastsData) {
      setTotalRoasts(Number(totalRoastsData));
    }
  }, [totalRoastsData]);

  // Update user roast count
  useEffect(() => {
    if (userRoastsData && Array.isArray(userRoastsData)) {
      setUserRoastCount(userRoastsData.length);
      loadUserRoasts(userRoastsData);
    }
  }, [userRoastsData]);

  // Handle successful roast submission
  useEffect(() => {
    if (isSubmitSuccess) {
      handleSuccess();
    }
  }, [isSubmitSuccess]);

  const loadUserRoasts = async (roastIds: bigint[]) => {
    const userRoasts = [];
    for (const roastId of roastIds) {
      try {
        const roastData = await fetch(`/api/roast/${roastId.toString()}`);
        if (roastData.ok) {
          const roast = await roastData.json();
          userRoasts.push({
            id: roastId.toString(),
            image: roast.originalImageIpfsHash,
            roast: roast.roastIpfsHash,
            timestamp: new Date(Number(roast.timestamp) * 1000),
            funnyVotes: Number(roast.funnyVotes),
            mehVotes: Number(roast.mehVotes),
            hasVoted: false, // Will be updated when we implement vote checking
            userVote: null
          });
        }
      } catch (error) {
        console.error(`Error loading roast ${roastId}:`, error);
      }
    }
    setRoastHistory(userRoasts);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedImage(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const generateRoast = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsRoasting(true);
    setError("");

    try {
      // Mock roast generation (AI integration removed)
      const mockRoasts = [
        "🔥 Oh snap! This selfie is giving major 'I just discovered filters' energy! 😂",
        "💀 Look who's trying to be Instagram famous! The camera angle says 'I'm artsy' but the expression says 'I'm confused' 😅",
        "🎭 This is giving 'I practiced this pose for 3 hours' vibes! The dedication is real, the result is... well, let's just say it's memorable! 😆",
        "🌟 Someone's been watching too many TikTok tutorials! The confidence is there, but the execution needs work! 😂",
        "🎪 This selfie is a whole mood! It's like you're saying 'I'm here, I'm fabulous, and I have no idea what I'm doing' 😄"
      ];
      const randomRoast = mockRoasts[Math.floor(Math.random() * mockRoasts.length)];
      setRoastResult(randomRoast);
    } catch (error) {
      console.error("Roast generation failed:", error);
      setError("Failed to generate roast. Please try again.");
    } finally {
      setIsRoasting(false);
    }
  };

  const submitRoastToContract = async () => {
    if (!selectedImage || !roastResult) {
      setError("Please select an image and generate a roast first");
      return;
    }

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Upload image and metadata to IPFS using the new function
      const { imageHash, metadataHash } = await uploadRoastToIPFS(
        selectedImage,
        roastResult,
        Date.now()
      );

      // Submit to contract
      submitRoast({
        address: ROAST_ME_CONTRACT_ADDRESS,
        abi: RoastMeContractABI,
        functionName: "submitRoast",
        args: [imageHash, metadataHash]
      });

    } catch (error) {
      console.error("Error submitting roast:", error);
      setError("Failed to submit roast. Please try again.");
      setIsLoading(false);
    }
  };

  const handleVote = async (roastId: string, isFunny: boolean) => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      voteRoast({
        address: ROAST_ME_CONTRACT_ADDRESS,
        abi: RoastMeContractABI,
        functionName: "voteRoast",
        args: [BigInt(roastId), isFunny]
      });
    } catch (error) {
      console.error("Error voting:", error);
      setError("Failed to vote. Please try again.");
    }
  };

  const handleSuccess = () => {
    // Reset form
    setSelectedImage(null);
    setImagePreview("");
    setRoastResult("");
    setIsLoading(false);
    
    // Add new roast to history
    const newRoast = {
      id: (totalRoasts + 1).toString(),
      image: imagePreview,
      roast: roastResult,
      timestamp: new Date(),
      funnyVotes: 0,
      mehVotes: 0,
      hasVoted: false,
      userVote: null
    };
    
    setRoastHistory(prev => [newRoast, ...prev]);
    setTotalRoasts(prev => prev + 1);
    setUserRoastCount(prev => prev + 1);
    
    // Show share options
    setShowShareOptions(true);
  };

  const clearForm = () => {
    setSelectedImage(null);
    setImagePreview("");
    setRoastResult("");
    setError("");
    setShowShareOptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const shareToFarcaster = () => {
    const shareText = `I just got roasted on VibeCaster! 😂🔥\n\n"${roastResult}"\n\nThis is hilarious! You too can try it out at vibecaster.xyz - dare to get roasted? 🔥`;
    
    // Farcaster sharing URL (you can customize this based on Farcaster's API)
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
    
    window.open(farcasterUrl, '_blank');
  };

  const shareToTwitter = () => {
    const shareText = `I just got roasted on VibeCaster! 😂🔥\n\n"${roastResult}"\n\nThis is hilarious! You too can try it out at vibecaster.xyz - dare to get roasted? 🔥`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    
    window.open(twitterUrl, '_blank');
  };

  const copyToClipboard = async () => {
    const shareText = `I just got roasted on VibeCaster! 😂🔥\n\n"${roastResult}"\n\nThis is hilarious! You too can try it out at vibecaster.xyz - dare to get roasted? 🔥`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Roast copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <FaFire className="text-red-500" /> Roast Me
        </h2>
        <p className="text-vibecaster-pink-light mb-4">
          Upload your selfie and let AI roast you! Get points for being brave enough to take the heat!
        </p>
        
        {/* Stats */}
        <div className="flex justify-center">
          <div className="bg-vibecaster-dark/50 backdrop-blur-sm rounded-lg border border-vibecaster-lavender/20">
            <div className="flex">
              <div className="px-4 py-2 text-center border-r border-vibecaster-lavender/20">
                <div className="text-white font-bold">{totalRoasts}</div>
                <div className="text-vibecaster-pink-light text-xs">Total Roasts</div>
              </div>
              {isConnected && (
                <div className="px-4 py-2 text-center border-r border-vibecaster-lavender/20 last:border-r-0">
                  <div className="text-white font-bold">{userRoastCount}</div>
                  <div className="text-vibecaster-pink-light text-xs">Your Roasts</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Roast Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Upload Your Selfie</h3>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mb-4">
                <Image
                  src={imagePreview}
                  alt="Selected image"
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={clearForm}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            )}

            {/* Drag and Drop Area */}
            {!imagePreview && (
              <div className="border-2 border-dashed border-vibecaster-lavender/20 rounded-lg p-8 text-center mb-4">
                <FaImage className="text-4xl text-vibecaster-lavender/50 mx-auto mb-4" />
                <p className="text-vibecaster-pink-light mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                <p className="text-xs text-vibecaster-pink-light">
                  Max file size: 5MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCameraCapture}
                className="flex-1 bg-vibecaster-lavender hover:bg-vibecaster-lavender/80 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaCamera size={16} />
                Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-vibecaster-purple-dark hover:bg-vibecaster-purple-dark/80 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaUpload size={16} />
                Upload
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Roast Generation Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Generate Your Roast</h3>
            
            {!roastResult ? (
              <button
                onClick={generateRoast}
                disabled={!selectedImage || isRoasting}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                {isRoasting ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    AI is analyzing your selfie...
                  </>
                ) : (
                  <>
                    <FaFire size={16} />
                    Generate AI Roast
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-vibecaster-purple-dark/20 p-4 rounded-lg">
                  <p className="text-white text-sm leading-relaxed">{roastResult}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={submitRoastToContract}
                    disabled={isLoading || isSubmitting || isConfirmingSubmit}
                    className="flex-1 bg-vibecaster-lavender hover:bg-vibecaster-lavender/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading || isSubmitting || isConfirmingSubmit ? (
                      <>
                        <FaSpinner className="animate-spin" size={16} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle size={16} />
                        Submit Roast
                      </>
                    )}
                  </button>
                  <button
                    onClick={generateRoast}
                    disabled={isRoasting}
                    className="px-4 py-3 border border-vibecaster-lavender text-vibecaster-lavender hover:bg-vibecaster-lavender hover:text-white rounded-lg transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error/Success Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isSubmitSuccess && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <FaCheckCircle size={16} />
              Roast submitted successfully! Check your transaction on the blockchain.
            </p>
          </div>
        )}

        {/* Share Options */}
        {showShareOptions && roastResult && (
          <div className="mt-6 p-4 bg-vibecaster-purple-dark/20 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FaShare size={16} />
              Share Your Roast!
            </h4>
            <p className="text-vibecaster-pink-light text-sm mb-4">
              Spread the laughter! Share your roast with the world! 😂
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={shareToFarcaster}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaShare size={14} />
                Share to Farcaster
              </button>
              <button
                onClick={shareToTwitter}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaTwitter size={14} />
                Share to Twitter
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-vibecaster-lavender hover:bg-vibecaster-lavender/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaShare size={14} />
                Copy Text
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Roast Gallery */}
      {roastHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaEye size={16} />
            Your Recent Roasts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roastHistory.map((roast) => (
              <div key={roast.id} className="bg-vibecaster-purple-dark/20 p-4 rounded-lg">
                <div className="relative mb-3">
                  <Image
                    src={roast.image}
                    alt="Roast selfie"
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <FaFire size={12} className="text-red-400" />
                    </div>
                  </div>
                </div>
                
                <p className="text-white text-xs mb-3 line-clamp-3 leading-relaxed">
                  {roast.roast}
                </p>
                
                <div className="flex items-center justify-between text-xs text-vibecaster-pink-light">
                  <span>{roast.timestamp.toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <FaHeart size={10} className="text-red-400" />
                      {roast.funnyVotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaThumbsDown size={10} className="text-gray-400" />
                      {roast.mehVotes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
