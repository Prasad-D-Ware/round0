"use client";

import { useState, useMemo, useEffect } from "react";
import { MockInterviewCard } from "@/components/mock-interview-card";
import type { MockInterview } from "@/components/mock-interview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Play, Loader2 } from "lucide-react";
import { getMockInterviews } from "@/api/operations/mock-interview-api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";

// Sample data from your API response
// const mockInterviewsData: MockInterview[] = [
//   {
//     title: "Frontend Developer Mock Interview",
//     description:
//       "We are looking for an Experienced Software Developer to join our team",
//     id: "cmcujdiez0003uzajsu3ivnow",
//   },
//   {
//     title: "Full Stack Developer Mock Interview",
//     description:
//       "We are looking for an Experienced Software Developer to join our team",
//     id: "cmcuj8lpm0001uzajf5qoyov4",
//   },
// ];

export default function MockInterviewsListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [mockInterviewsData, setMockInterviewsData] = useState<MockInterview[]>(
    []
  );
  const [filteredInterviews, setFilteredInterviews] =
    useState<MockInterview[]>([]);

  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    const fetchMockInterviews = async () => {
      try {
        setIsLoading(true);
        const response = await getMockInterviews(token);

        if (response?.success) {
          setMockInterviewsData(response?.data);
          setFilteredInterviews(response?.data); // Add this line to initialize filtered interviews
          // toast.success(response?.message);
        } else {
          toast.error(response?.message);
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching mock interviews");
        setIsLoading(false);
      }
    };
    if (token) {
      fetchMockInterviews();
    }
  }, [token]);

  // Add this useEffect to automatically update filtered interviews when data changes
  useEffect(() => {
    if (mockInterviewsData.length > 0) {
      applyFilters(searchTerm, activeFilter);
    }
  }, [mockInterviewsData]);

  // Dynamic interview type extraction
  const getInterviewType = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("frontend") || titleLower.includes("front-end"))
      return "Frontend";
    if (titleLower.includes("backend") || titleLower.includes("back-end"))
      return "Backend";
    if (titleLower.includes("full stack") || titleLower.includes("fullstack"))
      return "Full Stack";
    if (
      titleLower.includes("data") &&
      (titleLower.includes("scientist") ||
        titleLower.includes("analyst") ||
        titleLower.includes("engineer"))
    )
      return "Data Science";
    if (
      titleLower.includes("mobile") ||
      titleLower.includes("android") ||
      titleLower.includes("ios")
    )
      return "Mobile";
    if (titleLower.includes("devops") || titleLower.includes("sre"))
      return "DevOps";
    if (titleLower.includes("qa") || titleLower.includes("test"))
      return "QA/Testing";
    if (titleLower.includes("ui") || titleLower.includes("ux")) return "UI/UX";
    if (titleLower.includes("product")) return "Product";
    if (titleLower.includes("security")) return "Security";
    return "General";
  };

  // Dynamic statistics calculation
  const stats = useMemo(() => {
    const total = mockInterviewsData.length;
    const typeCount: Record<string, number> = {};

    mockInterviewsData.forEach((interview) => {
      const type = getInterviewType(interview.title);
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return {
      total,
      typeCount,
      mostPopularType:
        Object.entries(typeCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "General",
      avgDuration: "20-25 min", // This could be dynamic if duration data is available
    };
  }, [mockInterviewsData]);

  // Dynamic interview types for filtering
  const interviewTypes = useMemo(() => {
    const types = mockInterviewsData.map((interview) =>
      getInterviewType(interview.title)
    );
    return [...new Set(types)].sort();
  }, [mockInterviewsData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, activeFilter);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(searchTerm, filter);
  };

  const applyFilters = (searchTerm: string, filter: string) => {
    let filtered = mockInterviewsData;

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((interview) => {
        const titleMatch = interview.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const descriptionMatch = interview.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return titleMatch || descriptionMatch;
      });
    }

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter((interview) => {
        const interviewType = getInterviewType(interview.title);
        return interviewType === filter;
      });
    }

    setFilteredInterviews(filtered);
  };

  const handleGiveMockInterview = (interviewId: string) => {
    console.log(`Starting mock interview: ${interviewId}`);
    router.push(`/mockinterview/${interviewId}`);
  };

  // Get top 3 types for stats display
  const topTypes = Object.entries(stats.typeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PageShell
      title="Mock Interviews"
      description="Practice with realistic scenarios and get feedback."
      size="lg"
    >

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-xl font-semibold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total</p>
            </CardContent>
          </Card>
          {topTypes.map(([type, count]) => (
            <Card key={type}>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xl font-semibold">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{type}</p>
              </CardContent>
            </Card>
          ))}
          {topTypes.length < 3 && (
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xl font-semibold">{stats.avgDuration}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Avg Duration</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mock interviews..."
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
            {interviewTypes.map((type) => {
              const count = stats.typeCount[type] || 0;
              return (
                <Badge
                  key={type}
                  variant={activeFilter === type ? "default" : "secondary"}
                  className="cursor-pointer text-xs transition-colors"
                  onClick={() => handleFilterChange(type)}
                >
                  {type} ({count})
                </Badge>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {filteredInterviews.length} of {mockInterviewsData.length} interviews
          {searchTerm && <span> for &ldquo;{searchTerm}&rdquo;</span>}
          {activeFilter !== "all" && <span> in {activeFilter}</span>}
        </p>

        {filteredInterviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredInterviews.map((interview) => (
              <MockInterviewCard
                key={interview.id}
                mockInterview={interview}
                onGiveMockInterview={handleGiveMockInterview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Play className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No interviews found</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleSearch("");
                handleFilterChange("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
    </PageShell>
  );
}
