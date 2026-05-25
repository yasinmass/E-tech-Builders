import { Modal } from "@/components/ui/Modal";
import { Plus, Trash2, MapPin, Phone, MessageSquare, Loader2 } from "lucide-react";
import type { ETechProject } from "@/data/buildings";
import { useAddETechCategory, useDeleteETechCategory } from "@/hooks/useETech";
import { useState } from "react";
import { toast } from "sonner";
import { AssignETechForm } from "./AssignETechForm";

export function ETechDetailModal({
  project,
  onClose,
}: {
  project: ETechProject | null;
  onClose: () => void;
}) {
  const [newCat, setNewCat] = useState("");
  const addCategory = useAddETechCategory();
  const deleteCategory = useDeleteETechCategory();

  const handleAdd = async () => {
    if (!project || !newCat.trim()) return;
    try {
      await addCategory.mutateAsync({ projectId: project.id, name: newCat.trim() });
      setNewCat("");
      toast.success("Category added");
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!project) return;
    try {
      await deleteCategory.mutateAsync({ projectId: project.id, categoryId: id });
      toast.success("Category removed");
    } catch (err) {
      toast.error("Failed to remove category");
    }
  };

  return (
    <Modal open={!!project} onClose={onClose} title={project?.name ?? ""} maxWidth="max-w-4xl">
      {project && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-muted border border-border">
            <div className="h-48 md:h-64">
              {project.sitePhoto ? (
                <img src={project.sitePhoto} alt="Site" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                  <MapPin className="w-20 h-20" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-8">
              <div className="flex items-center gap-6 w-full">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden shrink-0 bg-muted">
                  {project.ownerPhoto ? (
                    <img src={project.ownerPhoto} alt={project.ownerName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-3xl">
                      {project.ownerName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <h3 className="font-display font-bold text-2xl md:text-4xl text-white truncate leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-white/80 font-medium md:text-lg mt-1">{project.ownerName}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {project.location || "—"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {project.contact || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <AssignETechForm project={project} />
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Manage Categories</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="New Category..."
                    className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleAdd}
                    disabled={addCategory.isPending}
                    className="p-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {project.categories.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">No categories added yet.</p>
                  ) : (
                    project.categories.map((c) => (
                      <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border text-xs group">
                        <span className="font-medium text-foreground">{c.name}</span>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={deleteCategory.isPending}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">Description</h4>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap italic">
                  "{project.description || "No project description provided."}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
