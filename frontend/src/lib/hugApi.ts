// export async function generateMoodImage(prompt: string): Promise<Blob> {
//   try {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify({
//           inputs: prompt,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Hugging Face API error: ${response.status} - ${response.statusText}`
//       );
//     }

//     // Handle binary image response
//     const blob = await response.blob();
//     if (blob.type !== "image/png" && blob.type !== "image/jpeg") {
//       throw new Error(`Unexpected response type: ${blob.type}`);
//     }

//     return blob;
//   } catch (error) {
//     console.error("generateMoodImage failed:", error);
//     throw error;
//   }
// }

// THE ABOVE IS VERY STABLE
