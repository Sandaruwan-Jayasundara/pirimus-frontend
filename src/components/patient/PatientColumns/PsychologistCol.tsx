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
                  <div>
                    <strong>Fee:</strong> {patient?.fee}
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
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );

}

export default PsychologistCol;
