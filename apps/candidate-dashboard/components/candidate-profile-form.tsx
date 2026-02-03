"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Award,
  Code,
  GraduationCap,
  Trophy,
  Heart,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { CandidateProfileData } from "@/api/operations/candidate-profile-api";

interface CandidateProfileFormProps {
  initialData?: CandidateProfileData;
  onSubmit: (data: CandidateProfileData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export function CandidateProfileForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  isEditMode = false,
}: CandidateProfileFormProps) {
  const [formData, setFormData] = useState<CandidateProfileData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    location: initialData?.location || "",
    linkedin_url: initialData?.linkedin_url || "",
    github_url: initialData?.github_url || "",
    portfolio_url: initialData?.portfolio_url || "",
    skills: initialData?.skills || [],
    experience: initialData?.experience || [],
    education: initialData?.education || [],
    certifications: initialData?.certifications || [],
    projects: initialData?.projects || [],
    achievements: initialData?.achievements || [],
    interests: initialData?.interests || [],
  });

  const handleInputChange = (
    field: keyof CandidateProfileData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayAdd = (field: keyof CandidateProfileData, value: string) => {
    if (!value.trim()) return;

    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }));
  };

  const handleArrayRemove = (
    field: keyof CandidateProfileData,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const ArrayInput = ({
    label,
    field,
    placeholder,
    icon: Icon,
  }: {
    label: string;
    field: keyof CandidateProfileData;
    placeholder: string;
    icon: React.ElementType;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const items = formData[field] as string[];

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {label}
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleArrayAdd(field, inputValue);
                setInputValue("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleArrayAdd(field, inputValue);
              setInputValue("");
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Badge key={index} variant="secondary" className="gap-1 pr-1.5">
                <span className="max-w-[20rem] truncate">{item}</span>
                <button
                  type="button"
                  className="ml-0.5 grid size-5 place-items-center rounded-full hover:bg-foreground/10"
                  onClick={() => handleArrayRemove(field, index)}
                  aria-label={`Remove ${label}`}
                  title={`Remove ${label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone is required");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    onSubmit(formData);
  };

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 ring-1 ring-inset ring-border/50">
            <Briefcase className="h-5 w-5 text-primary" />
          </span>
          {isEditMode ? "Edit Your Profile" : "Complete Your Profile"}
        </span>
      }
      description={
        isEditMode
          ? "Update your profile information to keep it current."
          : "Help recruiters learn more about you by completing your profile information."
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Presence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Online Presence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="linkedin_url"
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) =>
                      handleInputChange("linkedin_url", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="github_url"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) =>
                      handleInputChange("github_url", e.target.value)
                    }
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="portfolio_url"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Portfolio URL
                  </Label>
                  <Input
                    id="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={(e) =>
                      handleInputChange("portfolio_url", e.target.value)
                    }
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ArrayInput
                label="Skills"
                field="skills"
                placeholder="e.g., JavaScript, React, Node.js"
                icon={Code}
              />
              <Separator />
              <ArrayInput
                label="Work Experience"
                field="experience"
                placeholder="e.g., Software Engineer at ABC Company (2020-2023)"
                icon={User}
              />
              <Separator />
              <ArrayInput
                label="Education"
                field="education"
                placeholder="e.g., Bachelor's in Computer Science, XYZ University (2020)"
                icon={GraduationCap}
              />
              <Separator />
              <ArrayInput
                label="Certifications"
                field="certifications"
                placeholder="e.g., AWS Certified Developer"
                icon={Award}
              />
              <Separator />
              <ArrayInput
                label="Projects"
                field="projects"
                placeholder="e.g., E-commerce website with React and Node.js"
                icon={Code}
              />
              <Separator />
              <ArrayInput
                label="Achievements"
                field="achievements"
                placeholder="e.g., Winner of National Coding Competition 2023"
                icon={Trophy}
              />
              <Separator />
              <ArrayInput
                label="Interests"
                field="interests"
                placeholder="e.g., Machine Learning, Open Source, Photography"
                icon={Heart}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            {isEditMode && onCancel && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onCancel}
                disabled={isLoading}
                className="min-w-32"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading 
                ? "Saving..." 
                : isEditMode 
                  ? "Update Profile" 
                  : "Save Profile"
              }
            </Button>
          </div>
      </form>
    </PageShell>
  );
}
