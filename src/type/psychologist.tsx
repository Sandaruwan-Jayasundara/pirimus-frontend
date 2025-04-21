export type Psychologist = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // Updated to string
  fee: number;
  patientFee: number;
  status: "ACTIVE" | "INACTIVE";
  applyBlockTiming: boolean;
};