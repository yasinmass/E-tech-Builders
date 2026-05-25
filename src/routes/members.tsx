import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberCard } from "@/components/members/MemberCard";
import { AddMemberModal } from "@/components/members/AddMemberModal";
import { type Member } from "@/data/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAppStore, addMember, deleteMember, updateMember } from "@/store/app-store";
import { EditMemberModal } from "@/components/members/EditMemberModal";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members — BuildOps" },
      { name: "description", content: "Manage site workers and board members." },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const { members } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddMember = (data: Omit<Member, "id" | "createdAt">) => {
    addMember(data);
    toast.success("Member added successfully");
    setIsAddModalOpen(false);
  };

  const handleUpdateMember = (id: string, data: Partial<Member>) => {
    updateMember(id, data);
    toast.success("Member updated successfully");
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      deleteMember(id);
      toast.success("Member removed from fleet");
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Members
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage your workforce and organization members in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="rounded-2xl px-6 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lift hover:shadow-lift-lg transition-all hover:-translate-y-1 active:translate-y-0 group"
          >
            <UserPlus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-base">Add Member</span>
          </Button>
        </motion.div>
      </div>

      {/* Stats & Search bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-3xl"
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name or phone..." 
            className="pl-11 h-12 rounded-2xl border-none bg-background/50 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-6 px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground leading-none">{members.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Total</div>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary leading-none">{filteredMembers.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Found</div>
          </div>
        </div>
      </motion.div>

      {/* Members List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <MemberCard 
                  member={member} 
                  index={index} 
                  onEdit={(m) => setEditingMember(m)}
                  onDelete={handleDeleteMember}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border"
            >
              <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Users className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="text-lg font-bold">No members found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  We couldn't find any members matching your search criteria.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="rounded-xl font-semibold"
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddMemberModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />

      <EditMemberModal
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onUpdate={handleUpdateMember}
      />
    </div>
  );
}
