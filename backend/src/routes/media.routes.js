import { Router } from 'express';
import { getSignedUrlForVideo } from '../controllers/media.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/signed-url').post(getSignedUrlForVideo);

export default router;