import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save, Users, Loader2, Calendar, Clock } from "lucide-react";
import { MemberAssignRow } from "./MemberAssignRow";
import { toast } from "sonner";
import { useCreateETechAssignment } from "@/hooks/useETech";
import type { Building } from "@/data/buildings";

import { useAssignments } from "@/hooks/useAssignments";
import { useAppStore } from "@/store/app-store";

interface AssignMembersModalProps {
  building: Building | null;
  onClose: () => void;
}

interface Selection {
  [memberId: string]: {
    selected: boolean;
    name: string;
  };
}

export function AssignMembersModal({ building, onClose }: AssignMembersModalProps) {
  const { members } = useAppStore();
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState<Selection>({});
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));

  const mutation = useCreateETechAssignment();
  // Fetch existing assignments to check for conflicts
  const { data: assignments = [] } = useAssignments("", "etech");

  // Determine which members are already assigned to THIS project on THIS date
  const alreadyAssignedNames = useMemo(() => {
    if (!building || !date) return new Set<string>();
    
    // Filter assignments that match the current project and selected date
    const projectAssignmentsForDate = assignments.filter(a => 
      a.buildingName === building.name && 
      a.date.startsWith(date)
    );

    // Extract all member names from those assignments
    const names = new Set<string>();
    projectAssignmentsForDate.forEach(a => {
      a.details.forEach(d => names.add(d.category));
    });
    
    return names;
  }, [assignments, building, date]);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Clear any selections that become "already assigned" when date changes
  useEffect(() => {
    setSelections(prev => {
      const newSelections = { ...prev };
      let changed = false;
      Object.keys(newSelections).forEach(id => {
        const sel = newSelections[id];
        if (sel.selected && alreadyAssignedNames.has(sel.name)) {
          newSelections[id] = { ...sel, selected: false };
          changed = true;
        }
      });
      return changed ? newSelections : prev;
    });
  }, [date, alreadyAssignedNames]);

  const handleToggle = (memberId: string, name: string, selected: boolean) => {
    setSelections((prev) => ({
      ...prev,
      [memberId]: {
        selected,
        name,
      },
    }));
  };

  const handleSave = async () => {
    const selectedMembers = Object.entries(selections)
      .filter(([_, data]) => data.selected)
      .map(([id, data]) => ({ id, name: data.name }));

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    if (!building?.id) return;

    try {
      // Send member names as category names to the backend
      // The backend will find or create a category for each worker name
      const details = selectedMembers.map((m) => ({
        category_name: m.name,
        count: 1,
      }));

      await mutation.mutateAsync({
        project: parseInt(building.id),
        work_date: date,
        // @ts-ignore
        work_time: time,
        details: details
      });

      toast.success(`Successfully assigned ${selectedMembers.length} members to ${building.name}`);
      onClose();
      setSelections({});
    } catch (err) {
      toast.error("Failed to save assignment. Please try again.");
      console.error(err);
    }
  };

  const selectedCount = Object.values(selections).filter(s => s.selected).length;

  return (
    <Dialog open={!!building} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
        
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">Assign Members</DialogTitle>
              <DialogDescription className="text-gray-500 mt-1 text-sm font-medium">
                Select workers for <span className="font-bold text-gray-900">{building?.name}</span>
              </DialogDescription>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Schedule Date</label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Work Time</label>
              <div className="relative group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-5 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search members to assign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-primary/20 placeholder:text-gray-400 font-medium"
            />
          </div>
        </DialogHeader>

        <div className="px-6 py-5 max-h-[420px] overflow-y-auto space-y-3 custom-scrollbar">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <MemberAssignRow
                key={member.id}
                member={member}
                isSelected={!!selections[member.id]?.selected}
                isDisabled={alreadyAssignedNames.has(member.name)}
                onToggle={(selected) => handleToggle(member.id, member.name, selected)}
              />
            ))
          ) : (
            <div className="py-16 text-center text-gray-500 italic text-sm font-medium bg-gray-50/50 rounded-2xl mx-6">
              No members found matching "{search}"
            </div>
          )}
        </div>

        <DialogFooter className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-row items-center justify-between gap-4">
          <div className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] px-3 bg-white py-2 rounded-lg border border-gray-100 shadow-sm">
            {selectedCount} Selected
          </div>
          <div className="flex gap-2">
            <Button 
                variant="ghost" 
                onClick={onClose} 
                className="rounded-xl h-11 font-bold px-6 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={mutation.isPending || selectedCount === 0}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lift h-11 font-bold px-8 active:scale-95 transition-all"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Assignment
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
