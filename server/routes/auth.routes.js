import { Router } from 'express';
import {
  handleLogin,
  handleCallback,
  handleRefreshToken,
} from '../controllers/auth.controller.js';
import { setCorsHeaders, verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/login', setCorsHeaders, handleLogin);
router.post('/callback', setCorsHeaders, handleCallback);
router.post('/refresh', setCorsHeaders, handleRefreshToken);

// Example protected route
// router.get('/profile', setCorsHeaders, verifyToken(spotifyApi), (req, res) => {
//   res.json({ message: 'Protected route accessed' });
// });

export default router;
