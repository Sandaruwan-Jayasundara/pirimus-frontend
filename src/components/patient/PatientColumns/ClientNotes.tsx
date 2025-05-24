import { Patient } from "@/type/patient";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    patient: Patient;
};


const ClientNotes: React.FC<Props> = ({ patient }) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <div className="text-right">
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Notları Görüntüle
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Danışan Notları</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {patient.clientNotes && patient.clientNotes.trim() !== "" ? (
                <p>{patient.clientNotes}</p>
              ) : (
                <p>Mevcut not yok</p>
              )}
            </div>
            <div className="mt-4 text-right">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Kapat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );


}

export default ClientNotes;
