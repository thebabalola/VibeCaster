import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import IcebreakerContractArtifact from '@/abis/IcebreakerContract.json';

const ICEBREAKER_CONTRACT_ADDRESS = "0x95f87C578aA1d3E72Ba7ee27d2d506c3CE8f8f10";

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const total = searchParams.get('total');

    if (!total || parseInt(total) === 0) {
      return NextResponse.json([]);
    }

    const prompts = [];
    const totalPrompts = parseInt(total);

    for (let i = 1; i <= totalPrompts; i++) {
      try {
        const prompt = await client.readContract({
          address: ICEBREAKER_CONTRACT_ADDRESS as `0x${string}`,
          abi: IcebreakerContractArtifact.abi,
          functionName: 'getPrompt',
          args: [BigInt(i)],
        });

        if (prompt && prompt.exists) {
          prompts.push({
            creator: prompt.creator,
            text: prompt.text,
            category: prompt.category,
            timestamp: prompt.timestamp,
            exists: prompt.exists,
          });
        }
      } catch (error) {
        console.error(`Error fetching prompt ${i}:`, error);
        // Continue with other prompts even if one fails
      }
    }

    // Sort prompts by timestamp (newest first)
    prompts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}
