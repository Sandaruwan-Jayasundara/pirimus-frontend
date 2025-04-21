import { Patient, PatientStatus } from "@/type/patient";
import React, { useState } from "react";

import { updatePatientStatusAction } from "@/api/PatientApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
type Props = {
    patient: Patient;
};


const Status: React.FC<Props> = ({ patient }) => {

      const [status, setStatus] = useState<PatientStatus>(patient.status);

      const handleStatusChange = async (newStatus: PatientStatus) => {
        try {
          const backendStatus = newStatus.toUpperCase();
          await updatePatientStatusAction(patient.id, backendStatus);
          setStatus(newStatus);
          patient.status = newStatus;
        } catch (error) {
          console.error("Failed to update status:", error);
        }
      };

      return (
        <div className="text-right">
          <Select
            value={status}
            onValueChange={(value: PatientStatus) => handleStatusChange(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PatientStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={PatientStatus.INACTIVE}>InActive</SelectItem>
              <SelectItem value={PatientStatus.ON_BREAK}>OnBreak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );

}

export default Status;
