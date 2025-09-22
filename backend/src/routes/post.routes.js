import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createPost, getAllPosts } from '../controllers/post.controller.js';

const router = Router();

router.route('/')
    .post(verifyJWT, upload.single('video'), createPost)
    .get(getAllPosts);

export default router;