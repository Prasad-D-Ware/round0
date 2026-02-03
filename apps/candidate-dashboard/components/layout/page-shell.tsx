"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellSize = "md" | "lg" | "xl" | "full";

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
  size = "xl",
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  size?: PageShellSize;
}) {
  const maxWidth =
    size === "md"
      ? "max-w-4xl"
      : size === "lg"
        ? "max-w-5xl"
        : size === "full"
          ? "max-w-none"
          : "max-w-6xl";

  return (
    <section
      className={cn("mx-auto w-full px-4 py-8 md:px-8", maxWidth, className)}
    >
      {(title || description || actions) && (
        <header className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground text-balance">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
