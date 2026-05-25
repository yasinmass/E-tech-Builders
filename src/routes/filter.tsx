import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAssignments, useDeleteAssignment } from "@/hooks/useAssignments";
import { SearchBar } from "@/components/filter/SearchBar";
import { AssignmentCard } from "@/components/filter/AssignmentCard";
import { BreakdownModal } from "@/components/filter/BreakdownModal";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Assignment } from "@/data/buildings";

export const Route = createFileRoute("/filter")({
  head: () => ({
    meta: [
      { title: "Filter — BuildOps" },
      { name: "description", content: "Search assignments by building, category, or date." },
    ],
  }),
  component: FilterPage,
});

function FilterPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [type, setType] = useState<"all" | "builder" | "etech">("all");

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(timer);
  }, [q]);

  const { data: assignments = [], isLoading } = useAssignments(debouncedQ, type);
  const deleteMutation = useDeleteAssignment();

  const handleDelete = async (id: string, e: React.MouseEvent, recordType: "builder" | "etech") => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this assignment record?")) {
      try {
        await deleteMutation.mutateAsync({ id, type: recordType });
        toast.success("Assignment record deleted successfully");
      } catch (err) {
        toast.error("Failed to delete record. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="text-center mb-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-display">Find an assignment</h1>
        <p className="text-muted-foreground mb-8">Click any card to see detailed breakdown.</p>
        
        <div className="max-w-xl mx-auto space-y-6">
          <SearchBar value={q} onChange={setQ} />
          
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border w-fit mx-auto">
            {(["all", "builder", "etech"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  type === t
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "All" : t === "builder" ? "Builders" : "E Tech"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 max-w-5xl mx-auto pb-20">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-16"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          ) : assignments.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-muted-foreground font-medium"
            >
              {q ? "No results found for your search." : "No assignments registered yet."}
            </motion.div>
          ) : (
            assignments.map((a, i) => (
              <AssignmentCard
                key={a.id}
                assignment={a}
                index={i}
                onClick={() => setSelected(a)}
                onDelete={(id, e) => handleDelete(id, e, a.type)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <BreakdownModal assignment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
