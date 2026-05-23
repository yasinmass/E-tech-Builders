import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Upload } from "lucide-react";
import { addBuilding } from "@/store/app-store";

export function AddBuildingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [ownerPhoto, setOwnerPhoto] = useState<string>("");
  const [sitePhoto, setSitePhoto] = useState<string>("");

  const reset = () => {
    setName(""); setAddress(""); setPhone(""); setOwnerPhoto(""); setSitePhoto("");
  };

  const handleFile = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setter(URL.createObjectURL(f));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addBuilding({
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      ownerPhoto: ownerPhoto || "https://i.pravatar.cc/200?img=5",
      sitePhoto:
        sitePhoto ||
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=70",
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Building">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Building Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
            placeholder="e.g. Skyline Residency"
          />
        </Field>
        <Field label="Address">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input"
            placeholder="Street, City"
          />
        </Field>
        <Field label="Phone Number">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="+91 ..."
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUpload label="Owner Photo" preview={ownerPhoto} onChange={handleFile(setOwnerPhoto)} />
          <FileUpload label="Site Photo" preview={sitePhoto} onChange={handleFile(setSitePhoto)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">Save Building</button>
        </div>
      </form>
      <style>{`
        .input { width: 100%; padding: 0.65rem 0.9rem; border-radius: 0.75rem; border: 1px solid var(--border); background: var(--card); outline: none; transition: box-shadow .15s, border-color .15s; }
        .input:focus { border-color: var(--ring); box-shadow: 0 0 0 4px color-mix(in oklab, var(--ring) 25%, transparent); }
        .btn-primary { padding: 0.65rem 1.25rem; border-radius: 9999px; background: var(--primary); color: var(--primary-foreground); font-weight: 600; transition: transform .1s, box-shadow .15s; box-shadow: var(--shadow-soft); }
        .btn-primary:hover { transform: translateY(-1px); }
        .btn-ghost { padding: 0.65rem 1.25rem; border-radius: 9999px; color: var(--muted-foreground); font-weight: 500; }
        .btn-ghost:hover { background: var(--muted); }
      `}</style>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function FileUpload({
  label,
  preview,
  onChange,
}: {
  label: string;
  preview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
      <div className="relative border-2 border-dashed border-border rounded-xl overflow-hidden h-32 flex items-center justify-center bg-muted/40 hover:border-primary transition-colors cursor-pointer">
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground text-sm">
            <Upload className="w-5 h-5 mb-1" />
            Click to upload
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </label>
  );
}
