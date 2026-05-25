import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import type { Member } from "@/data/members";

interface MemberAssignRowProps {
  member: Member;
  isSelected: boolean;
  onToggle: (selected: boolean) => void;
  isDisabled?: boolean;
}

export function MemberAssignRow({
  member,
  isSelected,
  onToggle,
  isDisabled = false,
}: MemberAssignRowProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onToggle(!isSelected);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
        isDisabled 
          ? "bg-gray-100/50 border-gray-200 grayscale opacity-90 cursor-not-allowed shadow-inner" 
          : isSelected 
            ? "bg-primary/5 border-primary/20 shadow-sm cursor-pointer" 
            : "bg-background border-border/50 hover:border-border cursor-pointer text-foreground"
      }`}
    >
      <div className="flex-shrink-0">
        <Checkbox
          id={`member-${member.id}`}
          checked={isSelected}
          onCheckedChange={(v) => !isDisabled && onToggle(!!v)}
          disabled={isDisabled}
          className={`w-5 h-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary ${
            isDisabled ? "opacity-20" : ""
          }`}
        />
      </div>

      <div className="flex-shrink-0 relative">
        <Avatar className={`w-11 h-11 border-2 border-background shadow-soft ring-1 ring-primary/5 ${isDisabled ? "grayscale opacity-60" : ""}`}>
          <AvatarImage src={member.photo} alt={member.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
            {member.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {isDisabled && (
          <div className="absolute inset-0 bg-black/10 rounded-full" />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <label 
          htmlFor={`member-${member.id}`}
          className={`text-base font-bold truncate block ${
            isDisabled 
              ? "text-gray-400" 
              : isSelected 
                ? "text-primary" 
                : "text-foreground"
          } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {member.name}
        </label>
        <div className="flex items-center gap-2">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
             {isDisabled ? "Already Scheduled" : "Worker"}
           </p>
           {isDisabled && (
             <span className="w-1 h-1 rounded-full bg-gray-300 mt-0.5" />
           )}
        </div>
      </div>

      {isDisabled ? (
         <div className="px-2 py-1 rounded-lg bg-gray-200 text-[9px] font-black uppercase tracking-wider text-gray-500">
           Scheduled
         </div>
      ) : isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-soft"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
