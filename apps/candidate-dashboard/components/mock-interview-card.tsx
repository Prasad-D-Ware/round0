"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock } from "lucide-react"


export interface MockInterview {
    id: string
    title: string
    description: string
  }

  export interface MockInterviewsResponse {
    success: boolean
    message: string
    data: MockInterview[]
  }


interface MockInterviewCardProps {
  mockInterview: MockInterview
  onGiveMockInterview: (interviewId: string) => void
}

export function MockInterviewCard({ mockInterview, onGiveMockInterview }: MockInterviewCardProps) {
  const getInterviewType = (title: string) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes("frontend") || titleLower.includes("front-end")) return "Frontend"
    if (titleLower.includes("backend") || titleLower.includes("back-end")) return "Backend"
    if (titleLower.includes("full stack") || titleLower.includes("fullstack")) return "Full Stack"
    if (
      titleLower.includes("data") &&
      (titleLower.includes("scientist") || titleLower.includes("analyst") || titleLower.includes("engineer"))
    )
      return "Data Science"
    if (titleLower.includes("mobile") || titleLower.includes("android") || titleLower.includes("ios")) return "Mobile"
    if (titleLower.includes("devops") || titleLower.includes("sre")) return "DevOps"
    if (titleLower.includes("qa") || titleLower.includes("test")) return "QA/Testing"
    if (titleLower.includes("ui") || titleLower.includes("ux")) return "UI/UX"
    if (titleLower.includes("product")) return "Product"
    if (titleLower.includes("security")) return "Security"
    return "General"
  }

  const interviewType = getInterviewType(mockInterview.title)

  return (
    <Card className="transition-all hover:-translate-y-px hover:border-border/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-medium truncate">{mockInterview.title}</h3>
              <Badge variant="secondary" className="text-[10px] shrink-0">{interviewType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{mockInterview.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>25-30 min</span>
          </div>
          <Button
            onClick={() => onGiveMockInterview(mockInterview.id)}
            size="sm"
            className="text-xs cursor-pointer"
          >
            <Play className="h-3 w-3 mr-1.5" />
            Start Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
