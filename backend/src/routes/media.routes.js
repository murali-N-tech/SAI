import { Router } from 'express';
// 👇 UPDATE THIS LINE to import the new function name
import { getAuthenticationParametersForUpload } from '../controllers/media.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// This tells the router to use the verifyJWT middleware for the routes defined after it.
router.use(verifyJWT);

// 👇 UPDATE THIS LINE to use the new function name as the handler
router.route('/signed-url').post(getAuthenticationParametersForUpload);

export default router;