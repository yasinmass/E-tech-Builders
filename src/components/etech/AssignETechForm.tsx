import { useState } from "react";
import { Plus, Trash2, Save, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type ETechProject } from "@/data/buildings";
import { useCreateETechAssignment } from "@/hooks/useETech";
import { toast } from "sonner";

type Row = { id: string; category: number; count: number };

export function AssignETechForm({ project }: { project: ETechProject }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [workDate, setWorkDate] = useState(new Date().toISOString().split("T")[0]);
  
  const createAssignment = useCreateETechAssignment();

  const update = (id: string, patch: Partial<Row>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () => {
    if (project.categories.length === 0) {
      toast.error("Please add at least one category first");
      return;
    }
    setRows((r) => [...r, { id: crypto.randomUUID(), category: project.categories[0].id, count: 1 }]);
  };

  const removeRow = (id: string) =>
    setRows((r) => r.filter((row) => row.id !== id));

  const save = async () => {
    if (!rows.length) {
      toast.error("Please add at least one worker assignment.");
      return;
    }

    try {
      await createAssignment.mutateAsync({
        project: parseInt(project.id),
        work_date: workDate,
        details: rows.map(({ category, count }) => ({ category, count })),
      });
      toast.success("E Tech Assignment saved successfully");
      setRows([]);
    } catch (err) {
      toast.error("Failed to save assignment");
    }
  };

  return (
    <div className="pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg">Project Assignments</h3>
          <p className="text-sm text-muted-foreground">Log worker engagement for today</p>
        </div>
        <button
          onClick={addRow}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="mb-6 max-w-xs">
        <label className="block text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1.5 ml-1">Work Date</label>
        <input 
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {rows.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center border-2 border-dashed border-border rounded-3xl text-muted-foreground bg-muted/20"
            >
              <Info className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No entries yet. Click "Add Entry" to begin.</p>
            </motion.div>
          ) : (
            rows.map((row) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex gap-3 items-center"
              >
                <select
                  value={row.category}
                  onChange={(e) => update(row.id, { category: parseInt(e.target.value) })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card focus:border-ring focus:ring-4 focus:ring-ring/20 outline-none transition-all font-medium"
                >
                  {project.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={row.count}
                  onChange={(e) => update(row.id, { count: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-28 px-4 py-2.5 rounded-xl border border-border bg-card focus:border-ring focus:ring-4 focus:ring-ring/20 outline-none transition-all font-bold"
                />
                <button
                  onClick={() => removeRow(row.id)}
                  className="p-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {rows.length > 0 && (
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={save}
            disabled={createAssignment.isPending}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-foreground/10 active:scale-[0.98]"
          >
            {createAssignment.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {createAssignment.isPending ? "Saving..." : "Save All Work"}
          </button>
        </div>
      )}
    </div>
  );
}
