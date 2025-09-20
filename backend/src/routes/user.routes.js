import { Router } from 'express';
import { getMyProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Secured route
router.route("/me").get(verifyJWT, getMyProfile);

export default router;