import { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export async function generateMetadata(): Promise<Metadata> {
  const URL = "https://vibecaster.vercel.app";
  return {
    title: 'VibeCaster',
    description: 'The Future of Social on Farcaster - AI roasts, icebreakers, and viral challenges',
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: 'https://vibecaster.vercel.app/og.png',
        button: {
          title: 'Launch VibeCaster',
          action: {
            type: 'launch_frame',
            name: 'VibeCaster',
            url: URL,
            splashImageUrl: 'https://vibecaster.vercel.app/vibeCaster-logo.png',
            splashBackgroundColor: '#0C0420',
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="vibecaster-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
