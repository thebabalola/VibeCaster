declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

function withValidProperties(properties: Record<string, undefined | string | string[] | boolean>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (typeof value === 'boolean') return true;
      return Array.isArray(value) ? value.length > 0 : !!value;
    })
  );
}

export async function GET() {
  const URL = "https://vibecasters.vercel.app";
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: '1',
      name: 'VibeCaster',
      subtitle: 'AI Roasts and Challenges',
      description: 'AI roasts, icebreakers, and viral challenges - enhance your social interaction and engagement within the Farcaster ecosystem',
      screenshotUrls: [],
      iconUrl: 'https://vibecasters.vercel.app/og.png',
      splashImageUrl: 'https://vibecasters.vercel.app/vibecaster-logo.png',
      splashBackgroundColor: '#0C0420',
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: 'social',
      tags: [],
      heroImageUrl: 'https://vibecasters.vercel.app/og.png',
      tagline: 'AI Roasts and Viral Challenges',
      ogTitle: 'VibeCaster',
      ogDescription: 'The Future of Social on Farcaster - AI roasts, icebreakers, and viral challenges',
      ogImageUrl: 'https://vibecasters.vercel.app/og.png',
      // use only while testing
      noindex: true,
    }),
  });
}
