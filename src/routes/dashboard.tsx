import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HardHat } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BuildOps" },
      { name: "description", content: "Building supervisor dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center mb-6"
      >
        <HardHat className="w-9 h-9 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold"
      >
        Dashboard Coming Soon
      </motion.h1>
      <p className="mt-3 text-muted-foreground max-w-md">
        Insights, KPIs, and live site activity will land here.
      </p>
    </div>
  );
}
