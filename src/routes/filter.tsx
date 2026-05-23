import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { SearchBar } from "@/components/filter/SearchBar";
import { AssignmentCard } from "@/components/filter/AssignmentCard";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/filter")({
  head: () => ({
    meta: [
      { title: "Filter — BuildOps" },
      { name: "description", content: "Search assignments by building, category, or date." },
    ],
  }),
  component: FilterPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function FilterPage() {
  const { assignments } = useAppStore();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return assignments;
    return assignments.filter((a) =>
      [a.buildingName, a.category, formatDate(a.date)]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [assignments, q]);

  return (
    <div>
      <div className="text-center mb-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Find an assignment</h1>
        <SearchBar value={q} onChange={setQ} />
      </div>

      <div className="space-y-3 max-w-3xl mx-auto">
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-muted-foreground"
            >
              No results found.
            </motion.div>
          ) : (
            results.map((a, i) => (
              <AssignmentCard key={a.id} assignment={a} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
