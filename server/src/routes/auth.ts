import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, me, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, (req, res) => me(req as any, res));
router.post('/change-password', authenticate, (req, res) => changePassword(req as any, res));

export default router;
