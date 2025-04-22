// File: @/lib/PaymentApi.ts
"use server";
import {Payment} from "@/type/payment"; // Adjust path as needed
import {serverApi} from "@/lib/serverApi";

export const serverPaymentApi = async () => {
  const {get} = await serverApi();

  // Fetch payment history for the logged-in user
  const getPaymentHistory = (selectedDate: Date) => get<Payment[]>(`/api/payments/history/${selectedDate}`);

  return {
    getPaymentHistory,
  };
};

// Server Action to get payment history
export async function getPaymentHistoryAction(selectedDate: Date): Promise<Payment[]>
{
  const {getPaymentHistory} = await serverPaymentApi();
  return await getPaymentHistory(selectedDate);
}


// Server Action to get payment history
export async function getPaymentRecordHistoryAction
(date: Date) {
  const { get } = await serverApi();
  const payments = await get(`/api/payments/history-record/${date}`); 
  return payments;
}


export async function getRoomIncomeCountAction(date: Date) {
  const { get } = await serverApi();
  const payments = await get(`/api/appointments/room-income/${date}`); 
  return payments;
}



export async function getPsychologistCountAction
(date: Date) {
  const { get } = await serverApi();
  const payments = await get(`/api/appointments/psycho-income/${date}`); 
  return payments;
}

