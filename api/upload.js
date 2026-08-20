import { put } from '@vercel/blob';
import { verifyAuth } from './auth-middleware.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { imageBase64, filename } = req.body;
    
    if (!imageBase64 || !filename) {
      return res.status(400).json({ error: 'Missing imageBase64 or filename' });
    }

    // Convert base64 to buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Vercel Blob
    const blob = await put(filename, buffer, { 
      access: 'public',
      contentType: 'image/jpeg' 
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
