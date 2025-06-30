import { getSpotifyApi } from '../services/spotify.service.js';

export const setCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const spotifyApi = getSpotifyApi({ accessToken: token });
    await spotifyApi.getMe(); // Verify token is valid
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
