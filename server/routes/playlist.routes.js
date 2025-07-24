import { Router } from 'express';
import {
  generatePlaylistRecommendations,
  getUserSpotifyPlaylists,
  createOrUpdatePlaylist,
} from '../controllers/playlist.controller.js';
import { setCorsHeaders, verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Generate playlist recommendations using Gemini AI + Spotify
router.post(
  '/recommendations',
  setCorsHeaders,
  verifyToken, // Add token verification
  generatePlaylistRecommendations
);

// Get existing playlist
router.get(
  '/',
  setCorsHeaders,
  verifyToken, // Add token verification
    getUserSpotifyPlaylists
);

// Create and save playlist to Spotify
router.post(
  '/save',
  setCorsHeaders,
  verifyToken, // Add token verification
    createOrUpdatePlaylist
);

export default router;
