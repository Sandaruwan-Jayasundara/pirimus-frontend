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
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        disabled={!psychologist}
      >
        View Psychologist
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Psychologist Information</DialogTitle>
          </DialogHeader>

          {psychologist ? (
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {psychologist.firstName}{" "}
                {psychologist.lastName}
              </div>
              <div>
                <strong>Email:</strong> {psychologist.email}
              </div>
              <div>
                <strong>Phone:</strong> {psychologist.phoneNumber}
              </div>
            </div>
          ) : (
            <p>No psychologist assigned to this appointment.</p>
          )}

          <div className="mt-4 text-right">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PsychologistCell;
