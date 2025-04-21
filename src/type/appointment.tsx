// File: @/type/appointment.ts
import {Patient} from "@/type/patient";
import {Psychologist} from "@/type/psychologist";
import {PatientPayment} from "@/type/PatientPayment";

export type Appointment = {
  id: number;
  startTime: string;
  endTime: string;
  patient: Patient;
  psychologist?: Psychologist;
  roomId: number;
  roomName: string;
  branchId: number;
  branchName: string;
  totalFee?: number;
  paidAmount?: number;
  remainingAmount?: number;
  status: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
  patientPayment?: PatientPayment;
  assignedByAdmin?: boolean;

};

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NOT_ATTENDED = "NOT_ATTENDED",
  IN_PROGRESS = "IN_PROGRESS",
  CONFIRMED = "CONFIRMED",
  RESCHEDULED = "RESCHEDULED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIALLY_PAID= "PARTIALLY_PAID",
  COMPLETED = "COMPLETED",
}

export enum PaymentType {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  ONLINE_PAYMENT = "ONLINE_PAYMENT",
  INSURANCE = "INSURANCE",
}