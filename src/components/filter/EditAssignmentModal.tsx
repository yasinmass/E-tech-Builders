import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Assignment, WorkerCategory } from "@/data/buildings";
import { WORKER_CATEGORIES } from "@/data/buildings";
import { Save, Loader2, Trash2, Plus, Calendar, Clock, Building2, HardHat, Info } from "lucide-react";
import { useUpdateAssignment } from "@/hooks/useAssignments";
import { useBuildings } from "@/hooks/useBuildings";
import { useETechProjects } from "@/hooks/useETech";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Row = { id: string; category: string; count: number };

export function EditAssignmentModal({
  assignment,
  onClose,
}: {
  assignment: Assignment | null;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [buildingId, setBuildingId] = useState("");
  
  const updateMutation = useUpdateAssignment();
  const { data: buildings = [] } = useBuildings();
  const { data: etechProjects = [] } = useETechProjects();

  useEffect(() => {
    if (assignment) {
      setDate(assignment.date.split("T")[0]);
      setTime(assignment.date.includes("T") ? assignment.date.split("T")[1].slice(0, 5) : "00:00");
      setBuildingId(assignment.buildingId);
      setRows(
        assignment.details.map((d) => ({
          id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
          category: d.category,
          count: d.count,
        }))
      );
    }
  }, [assignment]);

  if (!assignment) return null;

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((r) => [
      ...r,
      {
        id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        category: assignment.type === "builder" ? "Mason" : "",
        count: 1,
      },
    ]);

  const removeRow = (id: string) =>
    setRows((r) => (r.length === 1 ? r : r.filter((row) => row.id !== id)));

  const handleSave = async () => {
    const validRows = rows.filter(r => r.count > 0 && r.category.trim() !== "");
    if (validRows.length === 0) {
      toast.error("Please add at least one valid worker category.");
      return;
    }

    try {
      const payload: any = {
        work_date: date,
        work_time: time,
        details: validRows.map((r) => ({
          category: assignment.type === "builder" ? r.category : undefined,
          category_name: assignment.type === "etech" ? r.category : undefined,
          count: r.count,
        })),
      };

      if (assignment.type === "builder") {
        payload.building = parseInt(buildingId);
      } else {
        payload.project = parseInt(buildingId);
      }

      await updateMutation.mutateAsync({
        id: assignment.id,
        type: assignment.type,
        payload,
      });
      
      toast.success("Assignment updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update assignment. Check console for details.");
      console.error(err);
    }
  };

  const formattedUpdateDate = (assignment as any).updatedAt 
    ? new Date((assignment as any).updatedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Not available";

  return (
    <Modal open={!!assignment} onClose={onClose} title="Edit Assignment" maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3" />
            Last Updated: {formattedUpdateDate}
          </div>
          <div>ID: #{assignment.id}</div>
        </div>

        {/* Building/Project Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            {assignment.type === "builder" ? "Building" : "E Tech Project"}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {assignment.type === "builder" ? <Building2 className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
            </div>
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm appearance-none"
            >
              {assignment.type === "builder" 
                ? buildings.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)
                : etechProjects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)
              }
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
              />
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Worker Breakdown</h4>
            <button
              onClick={addRow}
              className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              + Add Row
            </button>
          </div>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex gap-2 items-center"
                >
                  {assignment.type === "builder" ? (
                    <select
                      value={row.category}
                      onChange={(e) => updateRow(row.id, { category: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-sm focus:ring-4 focus:ring-primary/10 outline-none"
                    >
                      {WORKER_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      placeholder="Category name"
                      value={row.category}
                      onChange={(e) => updateRow(row.id, { category: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-sm focus:ring-4 focus:ring-primary/10 outline-none"
                    />
                  )}
                  <input
                    type="number"
                    step={0.5}
                    min={0}
                    value={row.count}
                    onChange={(e) => updateRow(row.id, { count: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-20 px-3 py-2 rounded-lg border border-border bg-card text-sm focus:ring-4 focus:ring-primary/10 outline-none"
                  />
                  <button
                    onClick={() => removeRow(row.id)}
                    className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          <button
            autoFocus
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
