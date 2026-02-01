import express, { type RequestHandler } from "express";
import { authenticateUser } from "../middlewares/user.middleware";
import { mockInterviewController } from "../controllers/mockinterview.controller";

const router = express.Router();

// Public endpoint for generating mock interview JD via OpenAI
router.post(
	"/generate_mock_interview_jd",
	mockInterviewController.generateMockInterviewJD,
);

router.get(
	"/get_mockinterviews",
	authenticateUser as RequestHandler,
	mockInterviewController.getMockInterviews,
);
router.post(
	"/start_mockinterview",
	authenticateUser as RequestHandler,
	mockInterviewController.startMockInterview,
);
router.get(
	"/get_mockinterview_details_and_attempts",
	authenticateUser as RequestHandler,
	mockInterviewController.getMockInterviewDetailsAndAttempts,
);
router.get(
	"/get_report",
	authenticateUser as RequestHandler,
	mockInterviewController.getReport,
);
router.get(
	"/get_my_reports",
	authenticateUser as RequestHandler,
	mockInterviewController.getMyReports,
);
router.get(
	"/candidate_stats",
	authenticateUser as RequestHandler,
	mockInterviewController.getCandidateMockInterviewStats,
);
router.get(
	"/analytics",
	authenticateUser as RequestHandler,
	mockInterviewController.getMockInterviewAnalytics,
);

export default router;