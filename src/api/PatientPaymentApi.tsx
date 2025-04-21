"use server";
import {serverApi} from "@/lib/serverApi";
import {PatientPayment} from "@/type/PatientPayment";
import {Appointment, PaymentStatus} from "@/type/appointment";

// Define the server API for patient payments
export const serverPatientPaymentApi = async () => {
  const {get, put} = await serverApi();

  // Fetch patient payment history for the logged-in user
  const getPatientPaymentHistory = () => get<PatientPayment[]>("/api/patient-payments/history");

  // Update patient payment details using the correct endpoint from PatientPaymentController
  const updatePatientPaymentDetails = (
      appointmentId: number,
      paidAmount: number,
      paymentStatus: PaymentStatus
  ) =>
      put<Appointment>(
          `/api/patient-payments/${appointmentId}/update/patient-payment`,
          {paidAmount, paymentStatus}
      );

  return {
    getPatientPaymentHistory,
    updatePatientPaymentDetails, // Updated to match backend endpoint
  };
};

// Server Action to get patient payment history
export async function getPatientPaymentHistoryAction(): Promise<PatientPayment[]>
{
  const {getPatientPaymentHistory} = await serverPatientPaymentApi();
  return await getPatientPaymentHistory();
}

// Server Action to update patient payment details
export async function updatePatientPaymentDetailsAction(
    appointmentId: number,
    paidAmount: number,
    paymentStatus: PaymentStatus
): Promise<Appointment>
{
  const {updatePatientPaymentDetails} = await serverPatientPaymentApi();
  return await updatePatientPaymentDetails(appointmentId, paidAmount, paymentStatus);
}