import { Router } from 'express';
import authRoutes from './auth.routes.js';
import playlistRoutes from './playlist.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/playlist', playlistRoutes);

export default router;
