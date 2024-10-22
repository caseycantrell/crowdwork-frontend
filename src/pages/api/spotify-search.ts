import type { NextApiRequest, NextApiResponse } from 'next';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

const getSpotifyToken = async (): Promise<string> => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      throw new Error('Missing Spotify client credentials.');
    }
  
    if (accessToken && Date.now() < tokenExpiresAt) {
      return accessToken; // safely return cached token
    }
  
    const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authHeader,
      },
      body: 'grant_type=client_credentials',
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify token');
    }
  
    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;
  
    if (!accessToken) {
      throw new Error('Failed to retrieve a valid access token.');
    }
  
    return accessToken;
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Invalid search query' });
  }

  try {
    const token = await getSpotifyToken();

    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!spotifyResponse.ok) {
      throw new Error('Failed to search Spotify.');
    }

    const data = await spotifyResponse.json();
    const tracks = data.tracks.items.map((track: any) => ({
      value: track.id,
      label: `${track.name} - ${track.artists.map((artist: any) => artist.name).join(', ')}`,
    }));

    res.status(200).json(tracks);
  } catch (error) {
    console.error('Error fetching from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch songs.' });
}};