import {PaymentStatus} from "@/type/appointment";

export type PatientPayment = {
  id?: number,
  paymentStatus: PaymentStatus,
  totalFee: number,
  paidAmount?: number,
  remainingAmount?: number,
  appointmentId?: number,
}