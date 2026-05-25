import { useEffect, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { isAuthenticated } from "@/api/auth";
import { useRouter, useRouterState } from "@tanstack/react-router";

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { pathname } = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (!isAuthenticated() && pathname !== "/login") {
      router.navigate({ to: "/login" });
    }
  }, [pathname, router]);

  if (!isAuthenticated() && pathname !== "/login") {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      {pathname !== "/login" && <Sidebar />}
      <main className={`${pathname !== "/login" ? "md:pl-64 pt-14 md:pt-0" : ""} min-h-screen`}>
        <div className={`${pathname !== "/login" ? "max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12" : ""}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
