"use client";

import { usePathname, useRouter } from "next/navigation";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ROUTE_META: Array<{
  startsWith: string;
  title: string;
  subtitle?: string;
}> = [
  { startsWith: "/mockinterview", title: "Mock Interviews", subtitle: "Practice and get better, fast." },
  { startsWith: "/mentor", title: "AI Mentor", subtitle: "Career guidance and interview prep." },
  { startsWith: "/jobs", title: "Jobs", subtitle: "Discover roles and apply." },
  { startsWith: "/applications", title: "Applications", subtitle: "Track your pipeline." },
  { startsWith: "/settings", title: "Settings", subtitle: "Profile and account preferences." },
];

function getRouteMeta(pathname: string) {
  return ROUTE_META.find((r) => pathname.startsWith(r.startsWith)) ?? {
    title: "Round0",
    subtitle: undefined,
  };
}

export function AppTopbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const meta = getRouteMeta(pathname);

  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/50 bg-background/60 backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-full items-center gap-3 px-4 md:px-8">
        <SidebarTrigger className="h-9 w-9 rounded-xl" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            {meta.title}
          </p>
          {meta.subtitle && (
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              {meta.subtitle}
            </p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 gap-2 rounded-xl md:inline-flex"
            onClick={() => router.push("/jobs")}
          >
            <Search className="h-4 w-4" />
            Search roles
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
