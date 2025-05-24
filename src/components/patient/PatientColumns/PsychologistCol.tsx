import { Patient } from "@/type/patient";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Psychologist } from "@/type/psychologist";

type Props = {
    patient: Patient;
};


const PsychologistCol: React.FC<Props> = ({ patient }) => {

      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const psychologist: Psychologist | undefined = patient.psychologist;

      return (
        <div className="text-right">
          <Button
             className="bg-primary/10"
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            disabled={!psychologist}
          >
           Psikologu Görüntüle
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
              <DialogTitle>Psikolog Bilgileri</DialogTitle>
              </DialogHeader>
              {psychologist ? (
                <div className="space-y-4">
                  <div>
                    <strong>Ad:</strong> {psychologist.firstName}{" "}
                    {psychologist.lastName}
                  </div>
                  <div>
                    <strong>E-posta:</strong> {psychologist.email}
                  </div>
                  <div>
                    <strong>Telefon:</strong> {psychologist.phoneNumber}
                  </div>
                  <div>
                    <strong>Ücret:</strong> {patient?.fee}
                  </div>
                </div>
              ) : (
                <p>No psychologist assigned to this patient.</p>
              )}
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

export default PsychologistCol;
