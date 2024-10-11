import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { djId } = req.query;

  if (typeof djId !== 'string') {
    return res.status(400).json({ error: 'Invalid DJ ID' });
  }

  try {
    const backendUrl = `${process.env.BACKEND_URL}/dj/${djId}`;
    const response = await fetch(backendUrl);

    // handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Optionally log in development, but not in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching DJ data:', error.message);
      }
      res.status(500).json({ error: 'Failed to fetch DJ data.' });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
};