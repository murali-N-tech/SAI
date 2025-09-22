import { Router } from 'express';
import { getAllTests } from '../controllers/test.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// This route will handle GET requests to /api/v1/tests
router.route('/').get(verifyJWT, getAllTests);

export default router;