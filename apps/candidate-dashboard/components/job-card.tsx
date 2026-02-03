"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, ArrowRight } from "lucide-react"
import { JobPosting } from "./job-posting"

interface JobCardProps {
  job: JobPosting
  onViewJob: (jobId: string) => void
}

export function JobCard({ job, onViewJob }: JobCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-px hover:border-border/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-foreground mb-1 truncate">{job.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {job.description.length > 200 ? job.description.slice(0, 200) + "..." : job.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <User className="h-3 w-3" />
              <span>{job.recruiter.name}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewJob(job.id)}
            className="shrink-0 text-xs"
          >
            View
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
