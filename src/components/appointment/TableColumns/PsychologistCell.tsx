import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/type/appointment";
import { Psychologist } from "@/type/psychologist";

// import { Appointment, Psychologist } from "@/types"; // adjust as needed

type Props = {
  appointment: Appointment;
};

const PsychologistCell: React.FC<Props> = ({ appointment }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const psychologist: Psychologist | undefined = appointment.psychologist;

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
            </div>
          ) : (
            <p>Bu randevuya atanmış bir psikolog yok.</p>
          )}

          <div className="mt-4 text-right">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PsychologistCell;
