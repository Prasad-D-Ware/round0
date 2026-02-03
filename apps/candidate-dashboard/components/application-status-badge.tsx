"use client"

import { Badge } from "@/components/ui/badge"

interface ApplicationStatusBadgeProps {
  status: string
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { variant: "outline" as const, label: "Pending" }
      case "invited":
        return { variant: "secondary" as const, label: "Invited" }
      case "in_progress":
        return { variant: "secondary" as const, label: "In Progress" }
      case "completed":
        return { variant: "secondary" as const, label: "Completed" }
      case "accepted":
        return { variant: "default" as const, label: "Accepted" }
      case "rejected":
        return { variant: "destructive" as const, label: "Rejected" }
      default:
        return { variant: "outline" as const, label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ") }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className="text-[10px] font-medium">
      {config.label}
    </Badge>
  )
}
