"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Loader2 } from "lucide-react";
import { JobCard } from "./job-card";
import { useRouter } from "next/navigation";
import { getAllJobs } from "@/api/operations/job-fetching-api";
import { useAuthStore } from "@/stores/auth-store";
import { PageShell } from "@/components/layout/page-shell";

export interface JobPosting {
    id: string
    title: string
    description: string
    recruiter: {
      name: string
    }
  }
  
  export interface JobListingsResponse {
    success: boolean
    message: string
    data: JobPosting[]
  }
  

export default function JobListings() {
    const [searchTerm, setSearchTerm] = useState("")
    const [jobData, setJobData] = useState<JobPosting[]>([]);
    const [filteredJobs, setFilteredJobs] = useState(jobData)
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuthStore();

    const router = useRouter();

    const fetchJobs = async () => {
          try {
            setIsLoading(true)
            const response = await getAllJobs(token as string);
            if(!response?.success){
              console.log(response?.message);
              return;
            }
            setJobData(response?.data);
            setFilteredJobs(response?.data);
          } catch (error) {
            console.error('Error fetching jobs:', error)
          } finally {
            setIsLoading(false)
          }
    }

	useEffect(() => {
    if(token){
        fetchJobs();
    } else {
        setIsLoading(false)
    }
	}, [token]);

    const handleSearch = (term: string) => {
      setSearchTerm(term)
      if (term.trim() === "") {
        setFilteredJobs(jobData)
      } else {
        const filtered = jobData.filter((job) => {
          const titleMatch = job.title.toLowerCase().includes(term.toLowerCase())
          const descriptionMatch = job.description.toLowerCase().includes(term.toLowerCase())
          const recruiterMatch = job.recruiter.name.toLowerCase().includes(term.toLowerCase())

          return titleMatch || descriptionMatch || recruiterMatch
        })
        setFilteredJobs(filtered)
      }
    }

    const handleApply = (jobId: string) => {
      router.push(`/jobs/${jobId}`)
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
        title="Jobs"
        description="Discover career opportunities from our curated listings."
        size="lg"
      >

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or recruiter..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            {filteredJobs.length} of {jobData.length} jobs
            {searchTerm && <span> for &ldquo;{searchTerm}&rdquo;</span>}
          </p>

          {/* Job Cards List */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onViewJob={handleApply} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Briefcase className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No jobs found</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleSearch("")
                  setFilteredJobs(jobData)
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
      </PageShell>
    )
  }
