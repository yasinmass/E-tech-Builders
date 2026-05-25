import { motion } from "framer-motion";
import { Calendar, Building2, Users, Hash, HardHat, Trash2, Clock } from "lucide-react";
import type { Assignment } from "@/data/buildings";
import { Button } from "@/components/ui/button";

export function AssignmentCard({
  assignment,
  index,
  onClick,
  onDelete,
}: {
  assignment: Assignment;
  index: number;
  onClick: () => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}) {
  const { date, time } = (() => {
    const d = new Date(assignment.date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const dateStr = `${day}/${month}/${year}`;
    
    // Check if assignment has a timestamp or explicit time
    let t = (assignment as any).time || (assignment.date.includes('T') ? assignment.date.split('T')[1].slice(0, 5) : "--:--");
    
    // If it's a builder type and time is 00:00, it's likely a default (no time set)
    if (assignment.type === "builder" && t === "00:00") {
      t = "--:--";
    }
    
    return { date: dateStr, time: t };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onClick}
      className="relative bg-card rounded-2xl p-6 px-10 shadow-soft border border-border hover:shadow-lift transition-all cursor-pointer hover:border-primary/50 group active:scale-[0.98]"
    >
      <div className="absolute top-1/2 -translate-y-1/2 right-6 flex items-center gap-4">
        <div className="flex flex-col items-end gap-2">
          <div className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
            {assignment.type === "builder" ? "Builder" : "E Tech"}
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onDelete(assignment.id, e)}
              className="w-10 h-10 rounded-xl text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 pr-32">
        <Cell icon={Calendar} label="Date" value={date} />
        <Cell icon={Clock} label="Time" value={time} />
        <Cell
          icon={assignment.type === "builder" ? Building2 : HardHat}
          label={assignment.type === "builder" ? "Building" : "Project"}
          value={assignment.buildingName}
        />
        <Cell
          icon={Users}
          label={assignment.type === "builder" ? "Category" : "Assigned"}
          value={
            assignment.type === "builder" 
              ? assignment.category 
              : assignment.count === 1 
                ? (assignment.details[0]?.category || "1 Member") 
                : `${assignment.count} Members`
          }
          highlight
        />
        <Cell icon={Hash} label="Count" value={String(assignment.count)} highlight />
      </div>
    </motion.div>
  );
}

function Cell({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 group-hover:text-primary transition-colors">
        <Icon className="w-3 h-3 opacity-60" /> {label}
      </div>
      <div
        className={`text-sm font-bold text-foreground truncate ${highlight ? "text-primary transition-colors" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
