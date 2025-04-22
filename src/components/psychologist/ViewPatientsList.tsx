"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getAllAdminAssignedPatientsAction,
  getOtherPatientsAction,
} from "@/api/PatientApi";
import { Patient } from "@/type/patient";

interface ViewPatientsListProps {
  psychologistId: number;
}

const ViewPatientsList: React.FC<ViewPatientsListProps> = ({
  psychologistId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminEarnings, setAdminPatient] = useState<Patient[] | null>(null);
  const [nonAdminEarnings, setNonAdminPatient] = useState<Patient[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch earnings
  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data for both tabs
      const adminAssignedPatients = await getAllAdminAssignedPatientsAction();
      const otherPatients = await getOtherPatientsAction();

      // Filter adminData and nonAdminData where psychologist.id equals myPsychologistId
      const filteredAdminData = adminAssignedPatients.filter(
        (data) => data.psychologist?.id === psychologistId
      );
      const filteredNonAdminData = otherPatients.filter(
        (data) => data.psychologist?.id === psychologistId
      );

      setAdminPatient(filteredAdminData);
      setNonAdminPatient(filteredNonAdminData);
    } catch (err) {
      setError("Failed to fetch earnings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open
  const handleOpen = async () => {
    setIsOpen(true);
    if (adminEarnings === null && nonAdminEarnings === null) {
      // Only fetch if we haven't fetched yet
      await fetchEarnings();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          handleOpen();
        } else {
          setIsOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Patients
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Patients List for Psychologist: {psychologistId}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mb-5">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <>
              {adminEarnings?.length === 0 && nonAdminEarnings?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No patients found.
                </p>
              ) : (
                <div className="flex justify-between mt-5">
                  <div>
                    <p className="text-xs italic font-bold mb-2 ms-3 ">
                      Admin Patient
                    </p>
                    <hr />
                    {adminEarnings?.map((patient) => (
                      <div key={patient.id}>
                        <div className="ms-2 mt-5">
                          <div className="flex">
                            <p className="text-s mb-2">
                              {patient.firstName + " " + patient.lastName}
                            </p>{" "}
                            <span className="text-primary text-sm ms-4">
                              {" "}
                              <p className="text-xs">
                                ₺{patient.fee?.toFixed(2) ?? "0.00"}
                              </p>
                            </span>
                          </div>

                          <p className="text-xs ">
                            {patient.registrationDate}
                          </p>
                        </div>
                        <hr />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs italic font-bold mb-2">
                      Psychologist Patient
                    </p>
                    <hr />
                    {nonAdminEarnings?.map((patient) => (
                      <div key={patient.id}>
                        <div className="mt-5">
                          <p className="text-s ">
                            {patient.firstName + " " + patient.lastName}
                          </p>
                          <p className="text-xs ">{patient.registrationDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPatientsList;
