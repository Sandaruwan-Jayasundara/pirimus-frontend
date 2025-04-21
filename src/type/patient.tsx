import {Psychologist} from "@/type/psychologist";

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fee: number;
  phone: string;
  patientFee: number;
  isAssignByAdmin: boolean;
  status: PatientStatus;
  isAssignedByAdmin?: boolean;
  clientNotes?: string; // New optional field for client notes
  psychologist?: Psychologist;
  registrationDate?: string;
}

export enum PatientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_BREAK = "ON_BREAK",
}