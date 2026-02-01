import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { INTERVIEW_ROUND_TYPE, JOB_APPLICATION_STATUS, USER_ROLE } from "@prisma/client";
import { createInterviewToken } from "../lib/interview-token";
import {
	getRoundSpecificInstructions,
	jobSpecificInstructions,
	getToolsForRoleCategory,
	getDifficultyInstructions,
} from "../lib/round-specific-instruction";
import { generateMockInterviewJD as generateMockInterviewJDService } from "../services/mockinterview-jd.service";

const getMockInterviews = async (req: Request, res: Response) => {
	try {
		const user = req.user;

		if(user.role === USER_ROLE.recruiter) {
			res.status(401).json({
				success: false,
				message: "Your are not authorised to get Mock Job Posting!",
			});
			return;
		}

		const job_postings = await prisma.job_description.findMany({
			where: {
				is_mock: true,
			},
			select: {
				title: true,
				description: true,
				id: true,
			},
			orderBy: {
				created_at: 'desc'
			},
		});

		if (!job_postings) {
			res.status(401).json({
				success: false,
				message: "No Mock Job Postings Found!",
			});
			return;
		}

		res.status(200).json({
			success: true,
			message: "Mock Job Postings!",
			data: job_postings,
		});
		return;

	} catch (error: any) {
		console.error("Error while getting mock job posting", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}
}

const generateMockInterviewJD = async (req: Request, res: Response) => {
	try {
		const { title, description } = req.body;

		if (!title || !description) {
			res.status(400).json({
				success: false,
				message: "Both title and description are required",
			});
			return;
		}

		const jd = await generateMockInterviewJDService(title, description);

		res.status(200).json({
			success: true,
			message: "Mock interview JD generated successfully",
			data: jd,
		});
		return;
	} catch (error) {
		console.error("Error generating mock interview JD:", error);
		res.status(500).json({
			success: false,
			message: "Failed to generate mock interview description",
		});
		return;
	}
};

const startMockInterview = async (req: Request, res: Response) => {
	const { mock_job_id } = req.body; 
	const { id: candidate_id } = req.user;
	
	try {
		// 1. auto create job application
		const application = await prisma.job_application.create({
			data: {
				candidate_id,
				job_description_id: mock_job_id as string,
				status: JOB_APPLICATION_STATUS.in_progress,
			}, 
			select: {
				id: true,
				candidate_id: true,
				job_description_id: true,
				job_description: {
					select: {
						recruiter_id: true,
						title: true,
						description: true,
						jd_payload: true,
						recruiter: {
							select: {
								name: true,
							}
						}
					}
				},
				candidate: {
					select: {
						name: true,
					}
				}
			}
		});

		// 2. auto create interview sessions
		const session = await prisma.interview_session.create({
			data: {
				application_id: application.id
			}
		});

		// 3. auto create interview round 
		const round = await prisma.interview_round.create({
			data: {
				session_id: session.id,
				round_number: 1,
				round_type: INTERVIEW_ROUND_TYPE.skill_assessment,
				status: 'pending',
				started_at: new Date(),
			}
		});

		// 4. generate interview token and return 

		const jdPayload = application.job_description.jd_payload as any;
		const roleCategory = jdPayload?.role_category || "engineering";
		const difficultyLevel = jdPayload?.difficulty_level || "mid";
		const interviewTools = jdPayload?.interview_tools || getToolsForRoleCategory(roleCategory);

		const tokenPayload = {
			candidate_id: application.candidate_id,
			recruiter_id: application.job_description.recruiter_id,
			job_description_id: application.job_description_id,
			application_id: application.id,
			interview_session_id: session.id,
			interview_round_id: round.id,
			round_type: round.round_type,
			round_number: round.round_number,
			type: 'interview_invitation' as const,
			title: application.job_description.title,
			candidate_name: application.candidate.name,
			recruiter_name: application.job_description.recruiter.name,
			description: application.job_description.description,
			jd_skills: jdPayload?.skills || "",
			jd_experience: jdPayload?.experience || "",
			jd_location: jdPayload?.location || "",
			interview_tools: interviewTools,
			role_category: roleCategory,
			difficulty_level: difficultyLevel,
			round_specific_instructions: getRoundSpecificInstructions(round.round_type as INTERVIEW_ROUND_TYPE),
			job_specific_instructions: jobSpecificInstructions(application.job_description.title),
			difficulty_instructions: getDifficultyInstructions(difficultyLevel),
		}

		const interview_token = createInterviewToken(tokenPayload, "24h");

		const interview_link = `${process.env.FRONTEND_URL}/interview?token=${interview_token}`;

		res.status(200).json({
			success: true,
			interview_token: interview_token,
			interview_token_payload: tokenPayload,
			round_id: round.id,
			redirect_url: interview_link,
		})

	} catch (error: any) {
		console.error("Error while starting mock interview", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}
}

const getMockInterviewDetailsAndAttempts = async (req: Request, res: Response) => {
	const { id: candidate_id } = req.user; 
	const { mock_job_id } = req.query;

	try {

		// 1. get mock job details
		const mock_job = await prisma.job_description.findUnique({
			where: {
				id: mock_job_id as string,
				is_mock: true,
			},
		})

		if(!mock_job) {
			res.status(401).json({
				success: false,
				message: "Mock job not found",
			});
			return;
		}

		// 2. get all attempts for the mock job
		const attempts = await prisma.job_application.findMany({
			where: {
				job_description_id: mock_job_id as string,
				candidate_id: candidate_id,
			},
			select: {
				id: true,
				job_description_id: true, 
				created_at: true, 
				status: true, 
				interview_session: {
					select: {
						id: true,
						interview_round: {
							select: {
								id: true,
								zero_score: true,
								ai_summary: true, 
								round_number: true, 
								round_type: true, 
							}
						}
					}
				}
			},
			orderBy: {
				created_at: 'desc'
			}
		})


		res.status(200).json({
			success: true,
			message: "Mock interview details and attempts",
			data: {
				mock_job,
				attempts,
			}
		})
		return;
	} catch (error) {
		console.error("Error while getting mock interview details and attempts", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}



}

const getReport = async (req: Request, res: Response) => {
	const { id: candidate_id } = req.user; 
	const { round_id } = req.query;
	
	try {
		if (!round_id) {
			res.status(400).json({
				success: false,
				message: "Round ID is required",
			});
			return;
		}

	// 2. get round report 
	const detailedReport = await prisma.interview_round.findUnique({
		where: {
			id: round_id as string,
			session: {
				application: {
					candidate_id: candidate_id,
				}
			}
		}, 
		select: {
			zero_score: true,
			score_components: true,
			ai_summary: true,
			report_data: true,
			report_generated_at: true,
			recruiter_decision: true,
		}
	})
	
	res.status(200).json({
		success: true,
		message: "Report fetched successfully for round",
		report: detailedReport,
	})
	return;

	} catch (error) {
		console.error("Error while getting mock interview details and attempts", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}
}

const getMyReports = async (req: Request, res: Response) => {
	const { id: candidate_id } = req.user;

	try {
		// 1. get all attempts for the candidate
		const attempts = await prisma.job_application.findMany({
			where: {
				candidate_id: candidate_id,
				status: JOB_APPLICATION_STATUS.completed,
				job_description: {
					is_mock: true,
				}
			}, 
			select: {
				id: true,
				job_description_id: true,
				created_at: true,
				status: true,
				interview_session: {
					select: {
						interview_round: {
							select: {
								id: true,
								zero_score: true,
								ai_summary: true,
								round_number: true,
								round_type: true,
								report_data: true,
								report_generated_at: true,
								recruiter_decision: true,
							}
						}
					}
				}
			}
		})

		res.status(200).json({
			success: true,
			message: "My reports",
			data: attempts,
		})
		return;

	} catch (error) {
		console.error("Error while getting my reports", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}
}

const getCandidateMockInterviewStats = async (req: Request, res: Response) => {
	const { id: candidate_id } = req.user;

	try {
		// Get all mock interview attempts
		const attempts = await prisma.job_application.findMany({
			where: {
				candidate_id: candidate_id,
				job_description: {
					is_mock: true,
				},
			},
			select: {
				id: true,
				status: true,
				created_at: true,
				job_description: {
					select: {
						title: true,
						jd_payload: true,
					},
				},
				interview_session: {
					select: {
						interview_round: {
							select: {
								zero_score: true,
								ai_summary: true,
								round_type: true,
							},
						},
					},
				},
			},
			orderBy: {
				created_at: "desc",
			},
		});

		const totalAttempts = attempts.length;
		const completedAttempts = attempts.filter(
			(a) => a.status === JOB_APPLICATION_STATUS.completed
		);

		// Calculate average score
		let totalScore = 0;
		let scoredCount = 0;
		for (const attempt of completedAttempts) {
			for (const session of attempt.interview_session) {
				for (const round of session.interview_round) {
					if (round.zero_score !== null && round.zero_score !== undefined) {
						totalScore += Number(round.zero_score);
						scoredCount++;
					}
				}
			}
		}
		const averageScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

		// Recent attempts (top 5)
		const recentAttempts = attempts.slice(0, 5).map((a) => ({
			id: a.id,
			title: a.job_description.title,
			status: a.status,
			created_at: a.created_at,
			role_category: (a.job_description.jd_payload as any)?.role_category || "other",
			score: a.interview_session?.[0]?.interview_round?.[0]?.zero_score ?? null,
		}));

		res.status(200).json({
			success: true,
			message: "Candidate mock interview stats",
			data: {
				totalAttempts,
				completedAttempts: completedAttempts.length,
				averageScore,
				recentAttempts,
			},
		});
		return;
	} catch (error) {
		console.error("Error getting candidate stats:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}
};

const getMockInterviewAnalytics = async (req: Request, res: Response) => {
	try {
		const user = req.user;

		if (user.role !== USER_ROLE.admin) {
			res.status(401).json({
				success: false,
				message: "You are not authorised!",
			});
			return;
		}

		// Total mock interviews
		const totalMockInterviews = await prisma.job_description.count({
			where: { is_mock: true },
		});

		// Total attempts
		const totalAttempts = await prisma.job_application.count({
			where: {
				job_description: { is_mock: true },
			},
		});

		// Completed attempts
		const completedAttempts = await prisma.job_application.count({
			where: {
				job_description: { is_mock: true },
				status: JOB_APPLICATION_STATUS.completed,
			},
		});

		// Get all scored rounds for average
		const scoredRounds = await prisma.interview_round.findMany({
			where: {
				session: {
					application: {
						job_description: { is_mock: true },
						status: JOB_APPLICATION_STATUS.completed,
					},
				},
				zero_score: { not: null },
			},
			select: {
				zero_score: true,
				session: {
					select: {
						application: {
							select: {
								job_description: {
									select: {
										jd_payload: true,
									},
								},
							},
						},
					},
				},
			},
		});

		let totalScore = 0;
		const roleScores: Record<string, { total: number; count: number }> = {};

		for (const round of scoredRounds) {
			const score = Number(round.zero_score);
			totalScore += score;
			const roleCategory =
				(round.session.application.job_description.jd_payload as any)?.role_category || "other";
			if (!roleScores[roleCategory]) {
				roleScores[roleCategory] = { total: 0, count: 0 };
			}
			roleScores[roleCategory].total += score;
			roleScores[roleCategory].count++;
		}

		const averageScore =
			scoredRounds.length > 0 ? Math.round(totalScore / scoredRounds.length) : 0;

		const rolePerformance = Object.entries(roleScores).map(([role, data]) => ({
			role,
			averageScore: Math.round(data.total / data.count),
			attempts: data.count,
		}));

		// Top candidates
		const candidateScores = await prisma.job_application.findMany({
			where: {
				job_description: { is_mock: true },
				status: JOB_APPLICATION_STATUS.completed,
			},
			select: {
				candidate: {
					select: {
						id: true,
						name: true,
					},
				},
				interview_session: {
					select: {
						interview_round: {
							select: {
								zero_score: true,
							},
						},
					},
				},
			},
		});

		const candidateMap: Record<string, { name: string; totalScore: number; count: number }> = {};
		for (const app of candidateScores) {
			const cid = app.candidate.id;
			if (!candidateMap[cid]) {
				candidateMap[cid] = { name: app.candidate.name, totalScore: 0, count: 0 };
			}
			for (const session of app.interview_session) {
				for (const round of session.interview_round) {
					if (round.zero_score !== null) {
						candidateMap[cid].totalScore += Number(round.zero_score);
						candidateMap[cid].count++;
					}
				}
			}
		}

		const leaderboard = Object.entries(candidateMap)
			.map(([id, data]) => ({
				id,
				name: data.name,
				averageScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
				totalAttempts: data.count,
			}))
			.sort((a, b) => b.averageScore - a.averageScore)
			.slice(0, 10);

		res.status(200).json({
			success: true,
			message: "Mock interview analytics",
			data: {
				totalMockInterviews,
				totalAttempts,
				completedAttempts,
				averageScore,
				completionRate:
					totalAttempts > 0
						? Math.round((completedAttempts / totalAttempts) * 100)
						: 0,
				rolePerformance,
				leaderboard,
			},
		});
		return;
	} catch (error) {
		console.error("Error getting analytics:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return;
	}
};

export const mockInterviewController = {
	getMockInterviews,
	startMockInterview,
	getMockInterviewDetailsAndAttempts,
	getReport,
	getMyReports,
	getCandidateMockInterviewStats,
	getMockInterviewAnalytics,
	generateMockInterviewJD,
}