import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Loader2, AlertCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuildings, useDeleteBuilding } from "@/hooks/useBuildings";
import { BuildingCard } from "@/components/buildings/BuildingCard";
import { AddBuildingModal } from "@/components/buildings/AddBuildingModal";
import { BuildingDetailModal } from "@/components/buildings/BuildingDetailModal";
import { EditBuildingModal } from "@/components/buildings/EditBuildingModal";
import type { Building } from "@/data/buildings";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/buildings")({
  head: () => ({
    meta: [
      { title: "Builders — BuildOps" },
      { name: "description", content: "Manage your registered builders." },
    ],
  }),
  component: BuildingsPage,
});

function BuildingsPage() {
  const { data: buildings = [], isLoading, error, refetch } = useBuildings();
  const deleteMutation = useDeleteBuilding();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Building | null>(null);
  const [editSelected, setEditSelected] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuildings = buildings.filter((b) =>
    [b.name, b.address, b.phone].some((v) =>
      v?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this building?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Building deleted successfully");
      } catch (err) {
        toast.error("Failed to delete building");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading builders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-destructive">
        <AlertCircle className="w-8 h-8 mb-4" />
        <h2 className="text-xl font-bold">Failed to load builders</h2>
        <p className="text-muted-foreground mt-2 mb-6">{(error as any)?.message || "Something went wrong"}</p>
        <button onClick={() => refetch()} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 mt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground">Builders</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            {filteredBuildings.length} registered {filteredBuildings.length === 1 ? "builder" : "builders"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search builders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
            />
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-soft hover:shadow-lift transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Add Builder
          </button>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredBuildings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-border rounded-3xl text-muted-foreground bg-muted/20"
            >
              <p className="text-lg font-medium">No results found.</p>
              <p className="text-sm opacity-60">Try a different search term or add a new builder.</p>
            </motion.div>
          ) : (
            filteredBuildings.map((b, index) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              >
                <BuildingCard 
                  building={b} 
                  index={index} 
                  onClick={() => setSelected(b)} 
                  onEdit={(b, e) => {
                    e.stopPropagation();
                    setEditSelected(b);
                  }}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <AddBuildingModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditBuildingModal 
        building={editSelected} 
        open={!!editSelected} 
        onClose={() => setEditSelected(null)} 
      />
      <BuildingDetailModal building={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
