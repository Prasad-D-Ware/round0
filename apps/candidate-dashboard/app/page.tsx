"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Code,
  BarChart3,
  MonitorCheck,
  Mic,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      router.push("/mockinterview");
    }
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (!mounted || isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen app-surface">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-surface text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Round0</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/login">
                Get Started
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/50 text-xs text-muted-foreground mb-8">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-powered interview preparation
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Ace your next
            <br />
            <span className="text-primary">interview</span> with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Practice with AI interviewers, get real-time feedback, and build
            the confidence to land your dream role.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild className="h-11 px-6">
              <Link href="/auth/login">
                Start practicing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              Everything you need to prepare
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A complete platform for interview preparation, from practice sessions to performance analytics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MonitorCheck,
                title: "Mock Interviews",
                description: "Practice with realistic AI-driven interviews tailored to your target role",
              },
              {
                icon: Bot,
                title: "AI Mentor",
                description: "Get personalized career guidance and interview preparation tips",
              },
              {
                icon: Code,
                title: "Live Code Editor",
                description: "Solve coding challenges in a real-time collaborative environment",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Track your progress with detailed reports and actionable insights",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl border border-border/50 bg-card hover:border-border hover:shadow-sm transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 border-t border-border/40 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Three steps to interview confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Create your profile",
                description: "Sign up and tell us about your skills, experience, and target roles.",
              },
              {
                step: "02",
                icon: Mic,
                title: "Practice with AI",
                description: "Take mock interviews with our AI interviewer. Get real-time feedback and detailed reports.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Track and improve",
                description: "Review your performance analytics, identify weak areas, and practice until you're ready.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 border-primary/20 text-primary font-semibold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join candidates who are already preparing smarter with AI.
          </p>
          <Button size="lg" asChild className="h-11 px-6">
            <Link href="/auth/login">
              Create free account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">Round0</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Round0. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
