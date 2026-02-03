"use client";

import { applyForJob } from "@/api/operations/job-application-api";
import { getJobById } from "@/api/operations/job-fetching-api";
import { JobDetail, JobDetailComponent } from "@/components/job-details";
import { useAuthStore } from "@/stores/auth-store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";

export default function JobDetailPage() {
	const [jobDetailData, setJobDetailData] = useState<JobDetail>();
	const [applied, setApplied] = useState(false);
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const { token } = useAuthStore();

	const job_id = params.job_id?.[0];

	const fetchJobDetails = async () => {
		setLoading(true);
		const response = await getJobById(job_id as string, token as string);

		if (!response?.success) {
			toast.error(response?.message);
			setLoading(false);
			return;
		}

		setJobDetailData(response?.data);
		setLoading(false);
	};
	useEffect(() => {
		if (job_id && token) {
			fetchJobDetails();
		}
	}, [job_id,token]);

	const handleApply = async (jobId: string) => {
		const response = await applyForJob(jobId, token as string);
		if (!response?.success) {
			toast.error(response?.message);
			return;
		}

		if (response?.success) {
			setApplied(true);
			toast.success(response?.message);
		}
	};

	return (
		<PageShell
			title={
				jobDetailData ? (
					<span className="flex items-center gap-2 min-w-0">
						<span className="truncate">{jobDetailData.title}</span>
						<Badge variant="secondary" className="text-[10px] shrink-0">
							{jobDetailData.jd_payload.employment_type}
						</Badge>
					</span>
				) : (
					"Job Details"
				)
			}
			description={jobDetailData?.description}
			size="lg"
		>
			{loading || !jobDetailData ? (
				<div className="flex items-center justify-center py-24">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : (
				<JobDetailComponent
					job={jobDetailData}
					onApply={handleApply}
					applied={applied}
				/>
			)}
		</PageShell>
	);
}
