import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MemberForm } from "./MemberForm";
import type { Member } from "@/data/members";

interface EditMemberModalProps {
  member: Member | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Member>) => void;
}

export function EditMemberModal({ member, onClose, onUpdate }: EditMemberModalProps) {
  return (
    <Dialog open={!!member} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-6 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        
        <DialogHeader className="pt-2 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit Member</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Update the information for this member.
          </DialogDescription>
        </DialogHeader>

        {member && (
          <MemberForm 
            initialData={member}
            onSubmit={(data) => {
              onUpdate(member.id, data);
              onClose();
            }} 
            onCancel={onClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
