import { put, list } from '@vercel/blob';
import { verifyAuth } from './auth-middleware.js';

export default async function handler(req, res) {
  // GET: Fetch the current gallery and gotw state
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'data.json' });
      const dataBlob = blobs.find(b => b.pathname === 'data.json');
      
      if (!dataBlob) {
        return res.status(200).json({ gallery: [], gotw: { before: null, after: null } });
      }

      const response = await fetch(dataBlob.url);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  // POST: Update the gallery and gotw state (Admin only)
  if (req.method === 'POST') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { gallery, gotw } = req.body;
      const payload = JSON.stringify({ gallery: gallery || [], gotw: gotw || {} });
      
      await put('data.json', payload, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving data:', error);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
