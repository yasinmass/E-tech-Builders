import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  FileDown,
  Calendar,
  Building2,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useBuildings } from "@/hooks/useBuildings";
import { toast } from "sonner";
import api from "@/api/axios";

/* ── helpers ───────────────────────────────────────────────────────────────── */
function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function firstOfMonthISO() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
}

/* ── main component ─────────────────────────────────────────────────────────── */
export function WorkforceReportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fromDate, setFromDate] = useState(firstOfMonthISO());
  const [toDate, setToDate]     = useState(todayISO());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: buildings = [], isLoading: buildingsLoading } = useBuildings();

  /* ── Select / deselect helpers ─────────────────────────────────────────── */
  const toggleBuilding = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allSelected = buildings.length > 0 && selectedIds.size === buildings.length;
  const toggleAll = () =>
    setSelectedIds(
      allSelected ? new Set() : new Set(buildings.map((b: any) => Number(b.id)))
    );

  /* ── PDF generation ─────────────────────────────────────────────────────── */
  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates.");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From Date cannot be after To Date.");
      return;
    }
    if (selectedIds.size === 0) {
      toast.error("Please select at least one building.");
      return;
    }

    setIsGenerating(true);
    try {
      const buildingsList = Array.from(selectedIds).join(",");
      const response = await api.get("/workforce-report/", {
        params: {
          from_date:  fromDate,
          to_date:    toDate,
          buildings:  buildingsList,
        },
        responseType: "blob",
      });

      // Build filename from Content-Disposition header or fall back
      const disposition = response.headers["content-disposition"] ?? "";
      let filename = "Workforce_Report.pdf";
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];

      // Trigger browser download
      const url = URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("PDF report downloaded successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.status === 400
          ? "No data found for the selected filters."
          : "Failed to generate PDF. Please try again.";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── UI ──────────────────────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-3xl bg-card shadow-lift overflow-hidden"
          >
            {/* ── Header gradient ────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base leading-tight">
                    Export PDF Report
                  </h2>
                  <p className="text-blue-200 text-[11px] mt-0.5">
                    Workforce summary by building & date
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* ── Body ──────────────────────────────────────────────────── */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Date range */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* From */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      From
                    </span>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* To */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      To
                    </span>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        value={toDate}
                        min={fromDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Building selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Select Buildings
                  </label>
                  {buildings.length > 0 && (
                    <button
                      onClick={toggleAll}
                      className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>

                <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
                  {buildingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : buildings.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground text-sm">
                      <AlertCircle className="w-5 h-5" />
                      No buildings found.
                    </div>
                  ) : (
                    buildings.map((b: any) => {
                      const id = Number(b.id);
                      const checked = selectedIds.has(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleBuilding(id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            checked
                              ? "bg-primary/5"
                              : "hover:bg-muted/40"
                          }`}
                        >
                          {checked ? (
                            <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Building2
                              className={`w-4 h-4 flex-shrink-0 ${
                                checked ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium truncate ${
                                checked ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {b.name}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Selection counter badge */}
                {selectedIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-[11px] text-primary font-semibold"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {selectedIds.size} building{selectedIds.size > 1 ? "s" : ""} selected
                  </motion.div>
                )}
              </div>
            </div>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedIds.size === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] text-white font-bold text-sm shadow-soft hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
