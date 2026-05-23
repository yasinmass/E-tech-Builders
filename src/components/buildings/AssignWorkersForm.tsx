import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WORKER_CATEGORIES, type Building, type WorkerCategory } from "@/data/buildings";
import { addAssignments } from "@/store/app-store";

type Row = { id: string; category: WorkerCategory; count: number };

export function AssignWorkersForm({ building }: { building: Building }) {
  const [rows, setRows] = useState<Row[]>([
    { id: crypto.randomUUID(), category: "Mason", count: 1 },
  ]);
  const [saved, setSaved] = useState(false);

  const update = (id: string, patch: Partial<Row>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((r) => [...r, { id: crypto.randomUUID(), category: "Electrician", count: 1 }]);

  const removeRow = (id: string) =>
    setRows((r) => (r.length === 1 ? r : r.filter((row) => row.id !== id)));

  const save = () => {
    const valid = rows.filter((r) => r.count > 0);
    if (!valid.length) return;
    addAssignments(building, valid);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Assign Workers</h3>
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex gap-3 items-center"
            >
              <select
                value={row.category}
                onChange={(e) => update(row.id, { category: e.target.value as WorkerCategory })}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-card focus:border-ring focus:ring-4 focus:ring-ring/20 outline-none"
              >
                {WORKER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={row.count}
                onChange={(e) => update(row.id, { count: Math.max(0, Number(e.target.value) || 0) })}
                className="w-24 px-3 py-2.5 rounded-xl border border-border bg-card focus:border-ring focus:ring-4 focus:ring-ring/20 outline-none"
              />
              <button
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="p-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Remove row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-end gap-3 mt-5">
        {saved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-accent font-medium"
          >
            Assignment saved
          </motion.span>
        )}
        <button
          onClick={save}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Save Assignment
        </button>
      </div>
    </div>
  );
}
