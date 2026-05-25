import { useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WORKER_CATEGORIES, type Building, type WorkerCategory } from "@/data/buildings";
import { useCreateAssignment } from "@/hooks/useAssignments";
import { toast } from "sonner";

type Row = { id: string; category: WorkerCategory; count: number };

export function AssignWorkersForm({ building }: { building: Building }) {
  const [rows, setRows] = useState<Row[]>([
    { id: crypto.randomUUID(), category: "Mason", count: 1 },
  ]);
  const [workDate, setWorkDate] = useState(new Date().toISOString().split("T")[0]);
  const [workTime, setWorkTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));
  
  const createAssignment = useCreateAssignment();

  const update = (id: string, patch: Partial<Row>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((r) => [...r, { id: crypto.randomUUID(), category: "Electrician", count: 1 }]);

  const removeRow = (id: string) =>
    setRows((r) => (r.length === 1 ? r : r.filter((row) => row.id !== id)));

  const save = async () => {
    const valid = rows.filter((r) => r.count > 0);
    if (!valid.length) {
      toast.error("Please add at least one row with a count > 0");
      return;
    }

    try {
      await createAssignment.mutateAsync({
        building: parseInt(building.id),
        work_date: workDate,
        work_time: workTime,
        details: valid.map(({ category, count }) => ({ category, count })),
      });
      toast.success("Assignment saved successfully");
      setRows([{ id: crypto.randomUUID(), category: "Mason", count: 1 }]);
    } catch (err) {
      toast.error("Failed to save assignment");
    }
  };

  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          Assign Workers
        </h3>
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Date</label>
          <input 
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Time</label>
          <input 
            type="time"
            value={workTime}
            onChange={(e) => setWorkTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
          />
        </div>
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
                min={0}
                step={0.5}
                value={row.count}
                onChange={(e) => update(row.id, { count: Math.max(0, parseFloat(e.target.value) || 0) })}
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
        <button
          onClick={save}
          disabled={createAssignment.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {createAssignment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {createAssignment.isPending ? "Saving..." : "Save Assignment"}
        </button>
      </div>
    </div>
  );
}
