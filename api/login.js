import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-prod';

  if (!adminPassword) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD not set.' });
  }

  if (password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '7d' });
    
    res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      path: '/'
    }));
    
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
}
