import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MemberForm } from "./MemberForm";
import { motion, AnimatePresence } from "framer-motion";
import type { Member } from "@/data/members";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Member, "id" | "createdAt">) => void;
}

export function AddMemberModal({ open, onClose, onAdd }: AddMemberModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-6 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        
        <DialogHeader className="pt-2 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight">Add New Member</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Fill in the details below to add a new member to the system.
          </DialogDescription>
        </DialogHeader>

        <MemberForm 
          onSubmit={(data) => {
            onAdd(data);
            onClose();
          }} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
}
