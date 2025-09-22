import { Router } from 'express';
import { getMyProfile, getAllSubmissionsForAdmin } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Secured route
router.route("/me").get(verifyJWT, getMyProfile);

// New Admin Route
router.route("/admin/submissions").get(verifyJWT, getAllSubmissionsForAdmin);


export default router;