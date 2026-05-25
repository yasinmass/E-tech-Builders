import { motion } from "framer-motion";
import { Edit2, ChevronRight, MapPin, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Building } from "@/data/buildings";
import { Button } from "@/components/ui/button";

interface BuildingCardProps {
  building: Building;
  index: number;
  onClick: () => void;
  onEdit?: (building: Building, e: React.MouseEvent) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

export function BuildingCard({ building, index, onClick, onEdit, onDelete }: BuildingCardProps) {
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
          <AvatarImage src={building.ownerPhoto} alt={building.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {building.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-bold text-foreground leading-none group-hover:text-primary transition-colors truncate">
          {building.name}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 opacity-60" />
            <span>{building.phone}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 opacity-60" />
            <span className="truncate max-w-[200px]">{building.address}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(building, e);
            }}
            className="w-10 h-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onDelete(building.id, e)}
            className="w-10 h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
        
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
