import { Modal } from "@/components/ui/Modal";
import { MapPin, Phone } from "lucide-react";
import type { Building } from "@/data/buildings";
import { AssignWorkersForm } from "./AssignWorkersForm";

export function BuildingDetailModal({
  building,
  onClose,
}: {
  building: Building | null;
  onClose: () => void;
}) {
  return (
    <Modal open={!!building} onClose={onClose} title={building?.name ?? ""} maxWidth="max-w-3xl">
      {building && (
        <div>
          <div className="relative h-48 md:h-60 rounded-2xl overflow-hidden mb-4">
            <img src={building.sitePhoto} alt="Site" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-start gap-4">
            <img
              src={building.ownerPhoto}
              alt="Owner"
              className="w-16 h-16 rounded-2xl object-cover border border-border"
            />
            <div className="flex-1">
              <h3 className="font-display font-semibold text-xl">{building.name}</h3>
              <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {building.address || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {building.phone || "—"}
                </div>
              </div>
            </div>
          </div>
          <AssignWorkersForm building={building} />
        </div>
      )}
    </Modal>
  );
}
