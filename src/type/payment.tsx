import {PaymentType} from "@/type/appointment";

export type Payment = {
  id: number;
  amount: number;
  paymentType: PaymentType;
  appointmentId: number;
  paymentDate: string;
  paymentTime: string;
  appointmentStartTime: string;
  patientId: number;
  patientName: string
  psychologistId: number;
  psychologistName: string;
}