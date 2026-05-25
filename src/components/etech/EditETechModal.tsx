import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Save } from "lucide-react";
import { useUpdateETechProject } from "@/hooks/useETech";
import { toast } from "sonner";
import type { ETechProject } from "@/data/buildings";

interface EditETechModalProps {
  project: ETechProject | null;
  open: boolean;
  onClose: () => void;
}

export function EditETechModal({ project, open, onClose }: EditETechModalProps) {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [ownerPhoto, setOwnerPhoto] = useState<File | null>(null);
  const [sitePhoto, setSitePhoto] = useState<File | null>(null);
  const [ownerPreview, setOwnerPreview] = useState("");
  const [sitePreview, setSitePreview] = useState("");

  const updateMutation = useUpdateETechProject();

  useEffect(() => {
    if (project && open) {
      setName(project.name || "");
      setOwnerName(project.ownerName || "");
      setLocation(project.location || "");
      setContact(project.contact || "");
      setDescription(project.description || "");
      setOwnerPreview(project.ownerPhoto || "");
      setSitePreview(project.sitePhoto || "");
      setOwnerPhoto(null);
      setSitePhoto(null);
    }
  }, [project, open]);

  const handleFile = (
    setter: (f: File | null) => void,
    previewSetter: (s: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      const reader = new FileReader();
      reader.onloadend = () => previewSetter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!name.trim()) return toast.error("Project name is required");

    try {
      await updateMutation.mutateAsync({
        id: project.id,
        payload: {
          name: name.trim(),
          ownerName: ownerName.trim(),
          location: location.trim(),
          contact: contact.trim(),
          description: description.trim(),
          ownerPhoto: ownerPhoto || undefined,
          sitePhoto: sitePhoto || undefined,
        },
      });
      toast.success("E Tech project updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
        <DialogHeader className="px-8 pt-8 pb-6 bg-white border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Save className="w-6 h-6 text-primary" /> Edit E Tech Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="px-8 py-8 space-y-5 bg-white overflow-y-auto max-h-[80vh]">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Project Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metro Station Phase 1"
              className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Owner Name</label>
              <Input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Client name"
                className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Contact</label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone or email"
                className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address"
              className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ongoing electrical and plumbing work..."
              className="rounded-xl bg-gray-50 border-gray-100 focus:bg-white min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Owner Photo</label>
              <div className="relative h-28 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center hover:border-primary/50 cursor-pointer overflow-hidden group">
                {ownerPreview ? (
                  <img src={ownerPreview} alt="Owner" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile(setOwnerPhoto, setOwnerPreview)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Site Photo</label>
              <div className="relative h-28 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center hover:border-primary/50 cursor-pointer overflow-hidden group">
                {sitePreview ? (
                  <img src={sitePreview} alt="Site" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile(setSitePhoto, setSitePreview)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="px-8 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-10 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lift shadow-primary/20"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
