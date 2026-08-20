import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export function verifyAuth(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.admin_token;
  
  if (!token) return false;
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-prod';
    jwt.verify(token, jwtSecret);
    return true;
  } catch (err) {
    return false;
  }
}
