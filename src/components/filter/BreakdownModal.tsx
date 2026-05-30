import { Modal } from "@/components/ui/Modal";
import type { Assignment } from "@/data/buildings";
import { Users, Calendar, Building2, ChevronRight, HardHat, Clock } from "lucide-react";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const dateStr = `${day}/${month}/${year}`;
  const timeStr = iso.includes('T') ? iso.split('T')[1].slice(0, 5) : "--:--";

  const formatAMPM = (t: string) => {
    if (!t || t === "--:--") return "--:--";
    try {
      let [hours, minutes] = t.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    } catch (e) {
      return t;
    }
  };

  return { date: dateStr, time: formatAMPM(timeStr) };
}

export function BreakdownModal({
  assignment,
  onClose,
}: {
  assignment: Assignment | null;
  onClose: () => void;
}) {
  const { date, time } = assignment ? formatDateTime(assignment.date) : { date: "", time: "" };

  return (
    <Modal
      open={!!assignment}
      onClose={onClose}
      title="Work Assignment Details"
      maxWidth="max-w-md"
    >
      {assignment && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {assignment.type === "builder" ? (
                <Building2 className="w-4 h-4 text-primary" />
              ) : (
                <HardHat className="w-4 h-4 text-primary" />
              )}
              <span>{assignment.buildingName}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Assigned Members
            </h3>
            <div className="space-y-2">
              {assignment.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium text-sm">{detail.category}</span>
                  </div>
                  {assignment.type === "builder" && (
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {detail.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Total Engagement</div>
            <div className="flex gap-2 text-sm">
              <span className="font-bold underline decoration-primary/30 underline-offset-4">
                {assignment.type === "builder" ? assignment.category : `${assignment.details.length} Members`}
              </span>
              <span className="text-muted-foreground px-1">•</span>
              <span className="font-bold text-primary">
                {assignment.type === "builder" ? `${assignment.count} Workers` : "Project Duty"}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
