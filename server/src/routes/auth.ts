import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, (req, res) => me(req as any, res));

export default router;
