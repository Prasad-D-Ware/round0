"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { Calendar } from "lucide-react"
export interface Application {
    id: string
    candidate_id: string
    job_description_id: string
    applied_at: string
    status: string
    created_at: string
    updated_at: string
    job_description: {
      id: string
      title: string
      description: string
    }
  }

  export interface ApplicationsResponse {
    success: boolean
    message: string
    data: Application[]
  }


interface MyApplicationCardProps {
  application: Application
  onViewJob: (jobId: string) => void
  onViewApplication: (applicationId: string) => void
}

export function MyApplicationCard({ application, onViewJob, onViewApplication }: MyApplicationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTimeSinceApplication = (dateString: string) => {
    const now = new Date()
    const appliedDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <Card className="transition-all hover:-translate-y-px hover:border-border/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-medium truncate">{application.job_description.title}</h3>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {application.job_description.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>Applied {formatDate(application.applied_at)}</span>
          </div>
          <span className="text-border">·</span>
          <span>{getTimeSinceApplication(application.applied_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
