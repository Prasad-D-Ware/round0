"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Briefcase, Calendar, User } from "lucide-react"

export interface JobDetail {
    id: string
    title: string
    description: string
    jd_payload: {
      skills: string[]
      location: string
      experience: string
      requirements: string[]
      employment_type: string
      responsibilities: string[]
    }
    recruiter: {
      name: string
      email: string
    }
    created_at: string
  }
  
  export interface JobDetailResponse {
    success: boolean
    message: string
    data: JobDetail
  }
  
interface JobDetailProps {
  job: JobDetail
  onApply: (jobId: string) => void
  applied: boolean
}

export function JobDetailComponent({ job, onApply, applied }: JobDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">{job?.title}</h1>
              <Badge variant="secondary" className="text-xs">
                {job?.jd_payload.employment_type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{job?.description}</p>
          </div>

          <div className="shrink-0">
            {applied ? (
              <Button size="default" disabled>
                <Briefcase className="h-4 w-4 mr-2" />
                Applied
              </Button>
            ) : (
              <Button onClick={() => onApply(job?.id)} size="default">
                <Briefcase className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{job?.jd_payload.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{job?.jd_payload.experience} experience</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Posted {formatDate(job?.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Recruiter */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{job?.recruiter.name}</p>
              <a href={`mailto:${job?.recruiter.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {job?.recruiter.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <div>
        <h3 className="text-sm font-medium mb-3">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job?.jd_payload.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Responsibilities and Requirements */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Key Responsibilities</h3>
          <ul className="space-y-2">
            {job?.jd_payload.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Requirements</h3>
          <ul className="space-y-2">
            {job?.jd_payload.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Apply */}
      {!applied && (
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Interested in this role?</p>
          <Button onClick={() => onApply(job?.id)} size="sm">
            Apply for this Position
          </Button>
        </div>
      )}
    </div>
  )
}
