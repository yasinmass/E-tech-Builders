import { motion } from "framer-motion";
import { Calendar, Building2, Users, Hash } from "lucide-react";
import type { Assignment } from "@/data/buildings";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function AssignmentCard({ assignment, index }: { assignment: Assignment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="bg-card rounded-2xl p-5 shadow-soft border border-border hover:shadow-lift transition-shadow"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Cell icon={Calendar} label="Date" value={formatDate(assignment.date)} />
        <Cell icon={Building2} label="Building" value={assignment.buildingName} />
        <Cell icon={Users} label="Category" value={assignment.category} />
        <Cell icon={Hash} label="Count" value={String(assignment.count)} />
      </div>
    </motion.div>
  );
}

function Cell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground mb-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="font-medium text-foreground truncate">{value}</div>
    </div>
  );
}
