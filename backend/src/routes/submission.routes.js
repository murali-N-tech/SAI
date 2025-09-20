import { Router } from 'express';
import { createSubmission, getMySubmissions, updateSubmissionScore } from '../controllers/submission.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Secured routes for athletes
router.route("/").post(verifyJWT, upload.single('video'), createSubmission);
router.route("/me").get(verifyJWT, getMySubmissions);

// Internal route for the analysis service
router.route("/update-score/:submissionId").patch(updateSubmissionScore);

export default router;