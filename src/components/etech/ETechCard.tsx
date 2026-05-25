import { motion } from "framer-motion";
import { ChevronRight, MapPin, Phone, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ETechProject } from "@/data/buildings";

interface ETechCardProps {
  project: ETechProject;
  index: number;
  onClick: () => void;
}

export function ETechCard({ project, index, onClick }: ETechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.005, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}
      onClick={onClick}
      className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4 md:gap-6 shadow-sm hover:border-primary/20 transition-all cursor-pointer group active:scale-[0.995]"
    >
      <div className="flex-shrink-0 w-8 md:w-10 text-center text-xs md:text-sm font-semibold text-muted-foreground/60">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex-shrink-0">
        <Avatar className="w-14 h-14 md:w-16 md:h-16 border-2 border-background shadow-soft ring-2 ring-primary/5">
          <AvatarImage src={project.sitePhoto || project.ownerPhoto} alt={project.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {project.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-bold text-foreground leading-none group-hover:text-primary transition-colors truncate">
          {project.name}
        </h3>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground font-medium">
          <span className="text-primary/70 font-bold text-xs uppercase tracking-tight">{project.ownerName}</span>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 opacity-60" />
            <span>{project.contact}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 opacity-60" />
            <span className="truncate max-w-[150px]">{project.location}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-3">
        <div className="hidden lg:flex flex-wrap items-center gap-1 mr-4">
          {project.categories.slice(0, 2).map((c) => (
            <span key={c.id} className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-bold text-secondary-foreground uppercase">
              {c.name}
            </span>
          ))}
          {project.categories.length > 2 && (
            <span className="text-[9px] font-bold text-muted-foreground/60">+{project.categories.length - 2}</span>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
