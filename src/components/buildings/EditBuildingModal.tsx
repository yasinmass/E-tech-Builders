import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Save } from "lucide-react";
import { useUpdateBuilding } from "@/hooks/useBuildings";
import { toast } from "sonner";
import type { Building } from "@/data/buildings";

interface EditBuildingModalProps {
  building: Building | null;
  open: boolean;
  onClose: () => void;
}

export function EditBuildingModal({ building, open, onClose }: EditBuildingModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [ownerPhoto, setOwnerPhoto] = useState<File | null>(null);
  const [sitePhoto, setSitePhoto] = useState<File | null>(null);
  const [ownerPreview, setOwnerPreview] = useState("");
  const [sitePreview, setSitePreview] = useState("");

  const updateBuilding = useUpdateBuilding();

  useEffect(() => {
    if (building && open) {
      setName(building.name || "");
      setAddress(building.address || "");
      setPhone(building.phone || "");
      setOwnerPreview(building.ownerPhoto || "");
      setSitePreview(building.sitePhoto || "");
      setOwnerPhoto(null);
      setSitePhoto(null);
    }
  }, [building, open]);

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
    if (!building) return;
    if (!name.trim()) return toast.error("Building name is required");

    try {
      await updateBuilding.mutateAsync({
        id: building.id,
        payload: {
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          owner_photo: ownerPhoto,
          site_photo: sitePhoto,
        },
      });
      toast.success("Building updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update building");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
        <DialogHeader className="px-8 pt-8 pb-6 bg-white border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Save className="w-6 h-6 text-primary" /> Edit Building
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="px-8 py-8 space-y-6 bg-white">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Building Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Skyline Residency"
              className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City"
              className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 ..."
              className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Owner Photo</label>
              <div className="relative h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group">
                {ownerPreview ? (
                  <img src={ownerPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                    <Upload className="w-6 h-6 mb-2 opacity-60" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Replace photo</span>
                  </div>
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
              <div className="relative h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group">
                {sitePreview ? (
                  <img src={sitePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                    <Upload className="w-6 h-6 mb-2 opacity-60" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Replace photo</span>
                  </div>
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

          <div className="flex items-center justify-end gap-3 pt-4">
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
              disabled={updateBuilding.isPending}
              className="px-10 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lift shadow-primary/20"
            >
              {updateBuilding.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Building"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
