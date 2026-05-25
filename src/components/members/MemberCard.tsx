import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Member } from "@/data/members";

interface MemberCardProps {
  member: Member;
  index: number;
  onEdit?: (m: Member) => void;
  onDelete?: (id: string) => void;
}

export function MemberCard({ member, index, onEdit, onDelete }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-6 shadow-sm hover:border-primary/20 transition-all group"
    >
      <div className="flex-shrink-0 w-12 text-center text-sm font-semibold text-muted-foreground/60">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex-shrink-0">
        <Avatar className="w-14 h-14 border-2 border-background shadow-soft ring-2 ring-primary/5">
          <AvatarImage src={member.photo} alt={member.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {member.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-bold text-foreground leading-none group-hover:text-primary transition-colors">{member.name}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 font-medium">{member.phone}</p>
        <p className="text-xs text-muted-foreground/80 mt-0.5 line-clamp-1">{member.address}</p>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="hidden sm:block px-3 py-1 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider text-secondary-foreground/70">
          Member
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(member)}
            className="w-10 h-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(member.id)}
            className="w-10 h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
