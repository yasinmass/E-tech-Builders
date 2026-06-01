import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAssignments, useDeleteAssignment } from "@/hooks/useAssignments";
import { SearchBar } from "@/components/filter/SearchBar";
import { AssignmentCard } from "@/components/filter/AssignmentCard";
import { BreakdownModal } from "@/components/filter/BreakdownModal";
import { EditAssignmentModal } from "@/components/filter/EditAssignmentModal";
import { WorkforceReportModal } from "@/components/filter/WorkforceReportModal";
import { BackupControls } from "@/components/filter/BackupControls";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, FileDown } from "lucide-react";
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
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [type, setType] = useState<"all" | "builder" | "etech">("all");

  // Debounce search query
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
    <div className="max-w-6xl mx-auto pt-6 flex flex-col items-center">
      {/* 1. Search Bar */}
      <div className="w-full mb-6">
        <SearchBar value={q} onChange={setQ} />
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border w-fit mb-6">
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

      {/* 3. Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <BackupControls />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPdfOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 h-12 rounded-2xl font-bold text-sm text-white shadow-soft transition-all
            bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] hover:shadow-lift hover:opacity-95"
        >
          <FileDown className="w-4 h-4" />
          Export PDF Report
        </motion.button>
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
                onEdit={(as) => setEditing(as)}
                onDelete={(id, e) => handleDelete(id, e, a.type)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <BreakdownModal assignment={selected} onClose={() => setSelected(null)} />
      <EditAssignmentModal assignment={editing} onClose={() => setEditing(null)} />
      <WorkforceReportModal open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </div>
  );
}
