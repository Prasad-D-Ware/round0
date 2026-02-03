"use client"

import { useEffect, useState } from "react"
import { MyApplicationCard } from "@/components/my-application-card"
import type { Application } from "@/components/my-application-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, FileText, Loader2 } from "lucide-react"
import { getAllApplications } from "@/api/operations/job-application-api"
import { useAuthStore } from "@/stores/auth-store"
import { PageShell } from "@/components/layout/page-shell"


export default function MyApplications() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [applicationsData, setApplicationsData] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const response = await getAllApplications(token)
        if(response?.success){
          setApplicationsData(response.data)
          setFilteredApplications(response.data)
        }
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if(mounted && token){
        fetchApplications()
    }
  }, [token, mounted])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, activeFilter)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    applyFilters(searchTerm, filter)
  }

  const applyFilters = (searchTerm: string, filter: string) => {
    let filtered = applicationsData

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((application) => {
        const titleMatch = application.job_description.title.toLowerCase().includes(searchTerm.toLowerCase())
        const descriptionMatch = application.job_description.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        return titleMatch || descriptionMatch
      })
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((application) => application.status === filter)
    }

    setFilteredApplications(filtered)
  }

  const handleViewJob = (jobId: string) => {
    console.log(`Viewing job: ${jobId}`)
    alert(`Opening job details for ID: ${jobId}`)
  }

  const handleViewApplication = (applicationId: string) => {
    console.log(`Viewing application: ${applicationId}`)
    alert(`Opening application details for ID: ${applicationId}`)
  }

  const getStats = () => {
    const total = applicationsData.length
    const pending = applicationsData.filter((app) => app.status === "pending").length
    const invited = applicationsData.filter((app) => app.status === "invited").length
    const inProgress = applicationsData.filter((app) => app.status === "in_progress").length
    const completed = applicationsData.filter((app) => app.status === "completed").length
    const accepted = applicationsData.filter((app) => app.status === "accepted").length
    const rejected = applicationsData.filter((app) => app.status === "rejected").length

    return { total, pending, invited, inProgress, completed, accepted, rejected }
  }

  const stats = getStats()
  const uniqueStatuses = [...new Set(applicationsData.map((app) => app.status))]

  // Don't render the main content until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <PageShell
      title="Applications"
      description="Track the status of your job applications."
      size="lg"
    >

        {/* Stats Row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Invited", value: stats.invited },
            { label: "In Progress", value: stats.inProgress },
            { label: "Accepted", value: stats.accepted },
            { label: "Rejected", value: stats.rejected },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={activeFilter === "all" ? "default" : "outline"}
              className="cursor-pointer text-xs transition-colors"
              onClick={() => handleFilterChange("all")}
            >
              All ({stats.total})
            </Badge>
            {uniqueStatuses.map((status) => {
              const count = applicationsData.filter((app) => app.status === status).length
              return (
                <Badge
                  key={status}
                  variant={activeFilter === status ? "default" : "secondary"}
                  className="cursor-pointer text-xs transition-colors"
                  onClick={() => handleFilterChange(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")} ({count})
                </Badge>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {filteredApplications.length} of {applicationsData.length} applications
          {searchTerm && <span> for &ldquo;{searchTerm}&rdquo;</span>}
        </p>

        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <MyApplicationCard
                key={application.id}
                application={application}
                onViewJob={handleViewJob}
                onViewApplication={handleViewApplication}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No applications found</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleSearch("")
                handleFilterChange("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
    </PageShell>
  )
}
