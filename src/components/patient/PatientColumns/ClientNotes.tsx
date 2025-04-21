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
          View Notes
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Client Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {patient.clientNotes && patient.clientNotes.trim() !== "" ? (
                <p>{patient.clientNotes}</p>
              ) : (
                <p>No notes available</p>
              )}
            </div>
            <div className="mt-4 text-right">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );


}

export default ClientNotes;
