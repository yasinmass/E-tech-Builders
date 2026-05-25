import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Member } from "@/data/members";

interface MemberFormProps {
  initialData?: Partial<Member>;
  onSubmit: (data: Omit<Member, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export function MemberForm({ initialData, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    photo: initialData?.photo || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 600);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      <div className="flex flex-col items-center gap-4 mb-2">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-background shadow-soft ring-2 ring-primary/10">
            {formData.photo ? (
              <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-muted-foreground/50" />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
          {formData.photo && (
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg border-2 border-background scale-90 hover:scale-100 transition-transform"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />
        <p className="text-xs font-medium text-muted-foreground">Upload Member Photo</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold ml-1">Member Name</Label>
          <Input
            id="name"
            placeholder="Enter full name"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-xl border-border/50 bg-secondary/30 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold ml-1">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            required
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="rounded-xl border-border/50 bg-secondary/30 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-semibold ml-1">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter full residential address"
            required
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="min-h-[100px] rounded-xl border-border/50 bg-secondary/30 focus-visible:ring-primary/20 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl h-11 font-semibold border-border/50 hover:bg-secondary/80"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            initialData ? "Update Details" : "Save Member"
          )}
        </Button>
      </div>
    </form>
  );
}
