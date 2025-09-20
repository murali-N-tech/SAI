import { Router } from 'express';
import { getLeaderboardByTest } from '../controllers/leaderboard.controller.js';

const router = Router();

router.route("/:testId").get(getLeaderboardByTest);

export default router;