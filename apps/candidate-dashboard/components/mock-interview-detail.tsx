"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttemptCard } from "./attempt-card"
import DetailedReportModal from "./detailed-report-modal"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Play,
  Calendar,
} from "lucide-react"
import type { MockInterviewDetailData } from "./attempt-card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getReport, startMockInterview } from "@/api/operations/mock-interview-api"
import { useAuthStore } from "@/stores/auth-store"
import { useInterviewTokenPayloadStore } from "@/stores/interview-token-payload-store"
import { useState } from "react"
import { PageShell } from "@/components/layout/page-shell"

export default function MockInterviewDetail({ mockInterviewDetailData }: { mockInterviewDetailData: MockInterviewDetailData }) {
  const { token } = useAuthStore(); 
  const { setToken, setInterviewTokenPayload } = useInterviewTokenPayloadStore(); 
  const { mock_job, attempts } = mockInterviewDetailData
  const router = useRouter()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const handleBack = () => {
    router.push("/mockinterview")
  }

  const handleStartNewInterview = async() => {
    try {
      const response = await startMockInterview(token, mock_job.id)
      if (response?.success) {
        setToken(response.interview_token)
        setInterviewTokenPayload(response.interview_token_payload)
        window.open(response.redirect_url, '_blank')
        toast.success("Mock interview started successfully!")
      } else {
        toast.error(response?.message)
      }
    } catch (error) {
      console.log("error while starting new mock interview", error)
    }
  }

  const handleViewAttemptDetails = async(attemptId: string) => {
    try {
      setReportLoading(true)
      setIsModalOpen(true)
      const response = await getReport(token, attemptId);
      if (response?.success) {
        setReportData(response.report)
      } else {
        toast.error(response?.message || "Failed to fetch report")
        setIsModalOpen(false)
      }
    } catch (error) {
      console.log("error while getting mock interview attempt details", error)
      toast.error("Error while getting mock interview attempt details")
      setIsModalOpen(false)
    } finally {
      setReportLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getOverallStats = () => {
    const totalAttempts = attempts.length
    const completedAttempts = attempts.filter((attempt) => attempt.status === "completed").length
    const inProgressAttempts = attempts.filter((attempt) => attempt.status === "in_progress").length

    const allScores = attempts.flatMap((attempt) =>
      attempt.interview_session.flatMap((session) => session.interview_round.map((round) => round.zero_score)),
    )

    const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0
    const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0

    return {
      totalAttempts,
      completedAttempts,
      inProgressAttempts,
      averageScore,
      bestScore,
    }
  }

  const stats = getOverallStats()

  return (
    <PageShell
      title={
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate">{mock_job.title}</span>
          <Badge variant="secondary" className="text-[10px] shrink-0">
            Mock
          </Badge>
        </div>
      }
      description={mock_job.description}
      actions={
        <Button onClick={handleStartNewInterview} size="sm" className="shrink-0 cursor-pointer">
          <Play className="h-3.5 w-3.5 mr-1.5" />
          Start Interview
        </Button>
      }
      size="lg"
    >
      <div className="-mt-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="-ml-2 text-xs text-muted-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span>{mock_job.jd_payload.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{mock_job.jd_payload.experience}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{mock_job.jd_payload.employment_type}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(mock_job.created_at)}</span>
        </div>
      </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-xl font-semibold">{stats.totalAttempts}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Attempts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-xl font-semibold">{stats.bestScore}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Best Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-xl font-semibold">{stats.averageScore}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-xl font-semibold">{stats.inProgressAttempts}</p>
              <p className="text-xs text-muted-foreground mt-0.5">In Progress</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
            <div>
              <h3 className="text-sm font-medium mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {mock_job.jd_payload.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-sm font-medium mb-3">Key Requirements</h3>
              <ul className="space-y-2">
                {mock_job.jd_payload.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Interview Attempts */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium mb-4">Interview Attempts ({attempts.length})</h3>
            {attempts.length > 0 ? (
              <div className="space-y-3">
                {attempts.map((attempt, index) => (
                  <AttemptCard
                    key={attempt.id}
                    attempt={attempt}
                    attemptNumber={attempts.length - index}
                    onViewDetails={handleViewAttemptDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Play className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No attempts yet</p>
                <Button onClick={handleStartNewInterview} size="sm" className="cursor-pointer">
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Start First Interview
                </Button>
              </div>
            )}
          </div>
        </div>
      {/* Detailed Report Modal */}
      <DetailedReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setReportData(null)
        }}
        reportData={reportData}
        loading={reportLoading}
      />
    </PageShell>
  )
}
