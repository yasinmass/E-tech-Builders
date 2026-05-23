import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-64 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12">{children}</div>
      </main>
    </div>
  );
}
