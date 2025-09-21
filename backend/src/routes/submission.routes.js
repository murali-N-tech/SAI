import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { 
    createSubmission, 
    getMySubmissions, // FIX: This now correctly imports getMySubmissions
    updateSubmissionScore 
} from '../controllers/submission.controller.js';

const router = Router();

router.route('/')
    .post(verifyJWT, upload.single('video'), createSubmission)
    .get(verifyJWT, getMySubmissions); // FIX: This now uses the correct function

router.route('/update-score').patch(updateSubmissionScore);

export default router;