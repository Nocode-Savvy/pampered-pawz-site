import cookie from 'cookie';

export default function handler(req, res) {
  // Clear the admin_token cookie by setting it to empty with immediate expiry
  res.setHeader('Set-Cookie', cookie.serialize('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 0,
    sameSite: 'strict',
    path: '/'
  }));

  return res.status(200).json({ success: true });
}
