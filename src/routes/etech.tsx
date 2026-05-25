import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useETechProjects } from "@/hooks/useETech";
import { BuildingCard } from "@/components/buildings/BuildingCard";
import { AssignMembersModal } from "@/components/etech/AssignMembersModal";
import { AddETechModal } from "@/components/etech/AddETechModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Users, Loader2, AlertCircle, HardHat, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/etech")({
  head: () => ({
    meta: [
      { title: "E Tech — Member Assignment" },
      { name: "description", content: "Assign workers and members to specific projects." },
    ],
  }),
  component: ETechAssignmentPage,
});

function ETechAssignmentPage() {
  const { data: projects = [], isLoading, error, refetch } = useETechProjects();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Adapt ETechProject to BuildingCard props
  const adaptProject = (p: any) => ({
    ...p,
    phone: p.contact,
    address: p.location,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold tracking-tight">Syncing projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-destructive">
        <AlertCircle className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Sync Error</h2>
        <p className="text-muted-foreground mt-2 mb-8 max-w-xs text-center font-medium">
          {(error as any)?.message || "We couldn't load the E Tech projects."}
        </p>
        <button 
          onClick={() => refetch()} 
          className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lift hover:opacity-90 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-1"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-1">
            <div className="p-1 rounded-lg bg-primary/10">
              <HardHat className="w-4 h-4" />
            </div>
            <span>E Tech Suite</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            E Tech
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Manage assignments for E Tech specific projects.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full md:w-64"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filter projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-2xl border-border/50 bg-card shadow-soft focus-visible:ring-primary/20"
            />
          </motion.div>
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lift hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add E Tech
          </Button>
        </div>
      </div>

      {/* Projects List for Assignment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xs uppercase tracking-[0.2em] font-black text-muted-foreground/60">
            Select Project for Assignment
          </h2>
          <div className="h-px flex-1 mx-4 bg-border/40" />
          <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-md uppercase tracking-widest">
            {filteredProjects.length} Projects
          </span>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ 
            show: { transition: { staggerChildren: 0.05 } } 
          }}
          className="grid grid-cols-1 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <BuildingCard 
                    building={adaptProject(project)} 
                    index={index} 
                    onClick={() => setSelectedProject(project)} 
                    onDelete={(id, e) => {
                      e.stopPropagation();
                      toast.info("E Tech deletion requested");
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center rounded-[2.5rem] border-2 border-dashed border-border bg-muted/20"
              >
                <div className="w-16 h-16 bg-background rounded-3xl flex items-center justify-center mx-auto shadow-sm mb-4">
                  <Search className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No projects found</h3>
                <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                   Try adding a new E Tech project using the button above.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AssignMembersModal
        building={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AddETechModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
