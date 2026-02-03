"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import {
  getCandidateProfile,
  createCandidateProfile,
  updateCandidateProfile,
  CandidateProfileData,
} from "@/api/operations/candidate-profile-api";
import { CandidateProfileForm } from "@/components/candidate-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit,
  Loader2,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/page-shell";

const SettingsPage = () => {
  const { token, user, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<CandidateProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const checkProfile = async () => {
    if (!token) return;
    try {
      const response = await getCandidateProfile(token);
      if (response?.success && response?.data) {
        setProfileData(response.data);
        setShowForm(false);
        setIsEditMode(false);
      } else {
        setShowForm(true);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkProfile();
    }
  }, [token]);

  const handleProfileSubmit = async (data: CandidateProfileData) => {
    setSubmitting(true);
    try {
      let response;
      if (isEditMode) {
        response = await updateCandidateProfile(data, token as string);
      } else {
        response = await createCandidateProfile(data, token as string);
      }
      if (response?.success) {
        toast.success(isEditMode ? "Profile updated successfully!" : "Profile created successfully!");
        setProfileData(response.data);
        setShowForm(false);
        setIsEditMode(false);
      } else {
        toast.error(response?.message || `Failed to ${isEditMode ? "update" : "create"} profile`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} profile:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} profile`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setIsEditMode(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateCompletion = () => {
    if (!profileData) return 0;
    const fields = [
      profileData.name,
      profileData.email,
      profileData.phone,
      profileData.location,
      profileData.linkedin_url,
      profileData.github_url,
      profileData.portfolio_url,
    ];
    const arrays = [
      profileData.skills,
      profileData.experience,
      profileData.education,
      profileData.certifications,
      profileData.projects,
      profileData.achievements,
      profileData.interests,
    ];
    const filledFields = fields.filter((f) => f && f.trim()).length;
    const filledArrays = arrays.filter((a) => a && a.length > 0).length;
    return Math.round(((filledFields + filledArrays) / (fields.length + arrays.length)) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (showForm) {
    return (
      <CandidateProfileForm
        initialData={profileData ?? undefined}
        onSubmit={handleProfileSubmit}
        isLoading={submitting}
        onCancel={handleCancelEdit}
        isEditMode={isEditMode}
      />
    );
  }

  const completion = calculateCompletion();

  return (
    <PageShell
      title="Settings"
      description="Manage your profile and account preferences."
      size="md"
    >
      <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="p-1.5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Shield className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header Card */}
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {profileData?.name ? getInitials(profileData.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{profileData?.name}</h2>
                      <p className="text-sm text-muted-foreground">{profileData?.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {profileData?.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {profileData.location}
                          </span>
                        )}
                        {profileData?.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {profileData.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleEditProfile} className="gap-2">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>

                {/* Profile Completion */}
                <div className="mt-6 p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile completion</span>
                    <span className="text-sm text-muted-foreground">{completion}%</span>
                  </div>
                  <Progress value={completion} className="h-1.5" />
                  {completion < 100 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete your profile to improve visibility with recruiters
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            {(profileData?.linkedin_url || profileData?.github_url || profileData?.portfolio_url) && (
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData?.linkedin_url && (
                    <a
                      href={profileData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  )}
                  {profileData?.github_url && (
                    <a
                      href={profileData.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  )}
                  {profileData?.portfolio_url && (
                    <a
                      href={profileData.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm">Portfolio</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profileData?.skills && profileData.skills.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience, Education, etc. */}
            {[
              { title: "Experience", data: profileData?.experience },
              { title: "Education", data: profileData?.education },
              { title: "Certifications", data: profileData?.certifications },
              { title: "Projects", data: profileData?.projects },
              { title: "Achievements", data: profileData?.achievements },
            ]
              .filter((section) => section.data && section.data.length > 0)
              .map((section) => (
                <Card key={section.title} className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.data!.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30 text-sm">
                        {item}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

            {/* Interests */}
            {profileData?.interests && profileData.interests.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, i) => (
                      <Badge key={i} variant="outline" className="font-normal">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">{user?.email || profileData?.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-destructive uppercase tracking-wider">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sign out</p>
                    <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </PageShell>
  );
};

export default SettingsPage;
