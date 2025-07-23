import { Router } from 'express';
import {
  generatePlaylistRecommendations,
  generateCoverArt,
  createPlaylist,
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

// Generate cover art description using Gemini AI
router.post(
  '/cover-art',
  setCorsHeaders,
  verifyToken, // Add token verification
  generateCoverArt
);

// Create and save playlist to Spotify
router.post(
  '/create',
  setCorsHeaders,
  verifyToken, // Add token verification
  createPlaylist
);

export default router;
