// @/type/commission.ts
export type CommissionDto = {
  commissionId: number;
  appointmentStartTime: string; // ISO date string
  appointmentEndTime: string;   // ISO date string
  psychologistName: string;
  commissionAmount: number;     // BigDecimal serialized as number
  patientName: string;
  status: "PENDING" | "PAID";   // Matches CommissionStatus enum
};