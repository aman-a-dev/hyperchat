import Ably from 'ably';

export const getAblyServer = () => {
  const key = process.env.ABLY_API_KEY;
  if (!key) throw new Error('Missing ABLY_API_KEY');
  return new Ably.Rest(key);
};

let ablyClient: Ably.Realtime | null = null;

export const getAblyClient = () => {
  if (!ablyClient) {
    const key = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!key) throw new Error('Missing NEXT_PUBLIC_ABLY_API_KEY');
    ablyClient = new Ably.Realtime({ key });
  }
  return ablyClient;
};