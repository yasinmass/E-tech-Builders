import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/app-store";
import { BuildingCard } from "@/components/buildings/BuildingCard";
import { AddBuildingModal } from "@/components/buildings/AddBuildingModal";
import { BuildingDetailModal } from "@/components/buildings/BuildingDetailModal";
import type { Building } from "@/data/buildings";

export const Route = createFileRoute("/buildings")({
  head: () => ({
    meta: [
      { title: "Buildings — BuildOps" },
      { name: "description", content: "Manage your registered buildings." },
    ],
  }),
  component: BuildingsPage,
});

function BuildingsPage() {
  const { buildings } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Building | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Buildings</h1>
          <p className="text-muted-foreground mt-1">
            {buildings.length} registered {buildings.length === 1 ? "site" : "sites"}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-lift transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Add Building
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="space-y-3"
      >
        {buildings.map((b) => (
          <motion.div
            key={b.id}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            <BuildingCard building={b} onClick={() => setSelected(b)} />
          </motion.div>
        ))}
      </motion.div>

      <AddBuildingModal open={addOpen} onClose={() => setAddOpen(false)} />
      <BuildingDetailModal building={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
