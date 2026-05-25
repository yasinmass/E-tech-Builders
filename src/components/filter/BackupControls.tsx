import { useState } from "react";
import { Download, Database, Loader2, CheckCircle2, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";

export function BackupControls() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{ builders: any[]; etech: any[] } | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await api.get("/backup/csv/?type=all", {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      link.setAttribute("download", `BuildOps-Full-Backup-${today}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Backup downloaded successfully!");
    } catch (error) {
      console.error("Backup failed", error);
      toast.error("Failed to generate backup. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/backup/history/");
      setHistory(data);
      setShowHistory(true);
    } catch (error) {
      toast.error("Could not fetch backup history.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-2xl px-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-soft flex items-center gap-2 transition-all"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isDownloading ? "Generating..." : "Download CSV Backup"}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={fetchHistory}
            className="rounded-2xl px-6 h-12 border-primary/20 hover:bg-primary/5 text-primary font-bold shadow-soft flex items-center gap-2 transition-all"
          >
            <History className="w-5 h-5" />
            Backup History
          </Button>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
          Weekly Auto Backup Enabled
        </span>
      </div>

      <AnimatePresence>
        {showHistory && history && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-2xl bg-card border border-border shadow-lift rounded-3xl overflow-hidden mt-4"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" /> Local Backups
              </h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="p-4 max-h-[300px] overflow-y-auto space-y-6">
              {/* Builders Section */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Builders History</p>
                <div className="space-y-2">
                  {history.builders.length > 0 ? (
                    history.builders.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border/50 text-sm">
                        <div className="flex items-center gap-3 font-medium">
                          <div className="p-2 rounded-xl bg-white shadow-sm font-bold text-primary text-[10px]">CSV</div>
                          <span>{file.filename}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-bold">{file.created_at}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-center py-4 opacity-50">No builder backups found.</p>
                  )}
                </div>
              </div>

              {/* E Tech Section */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">E Tech History</p>
                <div className="space-y-2">
                  {history.etech.length > 0 ? (
                    history.etech.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border/50 text-sm">
                        <div className="flex items-center gap-3 font-medium">
                          <div className="p-2 rounded-xl bg-white shadow-sm font-bold text-primary text-[10px]">CSV</div>
                          <span>{file.filename}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-bold">{file.created_at}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-center py-4 opacity-50">No E Tech backups found.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
