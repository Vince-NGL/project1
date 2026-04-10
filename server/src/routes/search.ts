import { Router } from 'express';
import { search } from '../controllers/searchController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/', authenticate, search);

export default router;
