import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Building } from "@/data/buildings";

export function BuildingCard({
  building,
  onClick,
}: {
  building: Building;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      className="w-full flex items-center gap-5 bg-card rounded-2xl p-4 md:p-5 shadow-soft hover:shadow-lift transition-shadow text-left border border-border"
    >
      <img
        src={building.ownerPhoto}
        alt={`${building.name} owner`}
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shrink-0 border border-border"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-lg md:text-xl truncate">
          {building.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Tap to view details</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </motion.button>
  );
}
