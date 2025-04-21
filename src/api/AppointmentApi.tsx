"use server";
import {Appointment, AppointmentStatus, PaymentStatus, PaymentType} from "@/type/appointment";
import {serverApi} from "@/lib/serverApi";
import {callApi} from "@/lib/apiUtils";

export const serverAppointmentApi = async () => {
  const {get, post, put, del} = await serverApi();

  const addAppointment = (data: Appointment) => post<Appointment>("/api/appointments", data);
  const getAllAppointments = () => get<Appointment[]>("/api/appointments/get-all");
  const updateAppointment = (data: Appointment) => put<Appointment>(`/api/appointments/${data.id}/reschedule`, data);
  const deleteAppointment = (appointmentId: number) => del<void>(`/api/appointments/${appointmentId}`);
  const updateAppointmentStatus = (appointmentId: number, status: AppointmentStatus) =>
      put<Appointment>(`/api/appointments/${appointmentId}/status?status=${status}`);

  const getDailyAppointmentCount = (date?: string) =>
      get<number>(`/api/appointments/count/daily${date ? `?date=${date}` : ""}`);
  const getWeeklyAppointmentCount = (date?: string) =>
      get<number>(`/api/appointments/count/weekly${date ? `?date=${date}` : ""}`);
  const getMonthlyAppointmentCount = (date?: string) =>
      get<number>(`/api/appointments/count/monthly${date ? `?date=${date}` : ""}`);
  const getCancelledOrNoShowAppointments = () => get<Appointment[]>(`/api/appointments/cancelled-no-show`);

  const getAllSlots = (psychologistId: number, date: string) =>
      get<string[]>(`/api/appointments/all-slots?psychologistId=${psychologistId}&date=${date}`);
  const getBusySlots = (psychologistId: number, date: string) =>
      get<string[]>(`/api/appointments/busy-slots?psychologistId=${psychologistId}&date=${date}`);
  const updatePaymentDetails = (
      appointmentId: number,
      paidAmount: number | undefined,
      paymentStatus: PaymentStatus | undefined,
      paymentType?: PaymentType | undefined
  ) =>
      put<Appointment>(`/api/appointments/${appointmentId}/payment`, {paidAmount, paymentStatus, paymentType});

  // New API call for updating patient payment details

  const getPartiallyPaidAppointments = () => get<Appointment[]>(`/api/appointments/partially-paid`);

  const getDailyAppointments = () => get<Appointment[]>(`/api/appointments/daily`);
  const getAdminAssignedAppointments = () => get<Appointment[]>(`/api/appointments/daily/admin-assigned`);
  const getOwnAppointments = () => get<Appointment[]>(`/api/appointments/daily/not-admin-assigned`);

  const getDailyAppointmentsForUser = () => get<Appointment[]>("/api/appointments/daily/list");
  const getWeeklyAppointmentsForUser = () => get<Appointment[]>("/api/appointments/weekly/list");
  const getMonthlyAppointmentsForUser = () => get<Appointment[]>("/api/appointments/monthly/list");

  const getDailyAppointmentsTotalFee = () => get<number>(`/api/appointments/total-fee/daily`);
  const getWeeklyAppointmentsTotalFee = () => get<number>(`/api/appointments/total-fee/weekly`);
  const getMonthlyAppointmentsTotalFee = () => get<number>(`/api/appointments/total-fee/monthly`);

  const getAdminAppointments = () => get<Appointment[]>("/api/appointments/admin-appointments");
  const getAllCompletedAppointments = (search: string, date: Date) => get<Appointment[]>(`/api/appointments/completed-appointments/${search}/${date}`);
  const getNonAdminAppointments = () => get<Appointment[]>("/api/appointments/non-admin-appointments");
  const getRoomByDateAndTime = (time: string, date: Date) => get<Appointment[]>(`/api/appointments/check-availability/${date}/${time}`);
  const getPsychologistByDateAndTime = (time: string, date: Date) => get<Appointment[]>(`/api/appointments/psychologist-availability/${date}/${time}`);

  

  return {
    getBusySlots,
    getAllSlots,
    addAppointment,
    getAllAppointments,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    getDailyAppointmentCount,
    getWeeklyAppointmentCount,
    getMonthlyAppointmentCount,
    getCancelledOrNoShowAppointments,
    updatePaymentDetails,
    getPartiallyPaidAppointments,
    getDailyAppointments,
    getAdminAssignedAppointments,
    getOwnAppointments,
    getDailyAppointmentsForUser,
    getWeeklyAppointmentsForUser,
    getMonthlyAppointmentsForUser,
    getDailyAppointmentsTotalFee,
    getWeeklyAppointmentsTotalFee,
    getMonthlyAppointmentsTotalFee,
    getAdminAppointments,
    getNonAdminAppointments,
    getAllCompletedAppointments,
    getRoomByDateAndTime,
    getPsychologistByDateAndTime
  };
};

// Existing action functions (unchanged)
export async function addAppointmentAction(appointmentData: Appointment)
{  
  const {addAppointment} = await serverAppointmentApi();
  return await addAppointment(appointmentData);
}

export async function getAllSlotsAction(psychologistId: number, date: string): Promise<string[]>
{
  const {getAllSlots} = await serverAppointmentApi();
  return await getAllSlots(psychologistId, date);
}

export async function getBusySlotsAction(psychologistId: number, date: string): Promise<string[]>
{
  const {getBusySlots} = await serverAppointmentApi();
  return await getBusySlots(psychologistId, date);
}
export async function updateAppointmentAction(appointmentData: Appointment)
{
  const {updateAppointment} = await serverAppointmentApi();
  return await updateAppointment(appointmentData);
}

export async function deleteAppointmentAction(appointmentId: number)
{
  const {deleteAppointment} = await serverAppointmentApi();
  await deleteAppointment(appointmentId);
}

export async function getAllAppointments(): Promise<Appointment[]>
{
  const {getAllAppointments} = await serverAppointmentApi();
  return await getAllAppointments();
}

export async function updateAppointmentStatusAction(appointmentId: number, status: AppointmentStatus): Promise<{
  success: boolean;
  data?: Appointment;
  error?: unknown
}>
{
  const {updateAppointmentStatus} = await serverAppointmentApi();
  return callApi(() => updateAppointmentStatus(appointmentId, status));
}

export async function getDailyAppointmentCountAction(date?: string): Promise<number>
{
  const {getDailyAppointmentCount} = await serverAppointmentApi();
  return await getDailyAppointmentCount(date);
}

export async function getWeeklyAppointmentCountAction(date?: string): Promise<number>
{
  const {getWeeklyAppointmentCount} = await serverAppointmentApi();
  return await getWeeklyAppointmentCount(date);
}

export async function getMonthlyAppointmentCountAction(date?: string): Promise<number>
{
  const {getMonthlyAppointmentCount} = await serverAppointmentApi();
  return await getMonthlyAppointmentCount(date);
}

export async function getCancelledOrNoShowAppointmentsAction(): Promise<Appointment[]>
{
  const {getCancelledOrNoShowAppointments} = await serverAppointmentApi();
  return await getCancelledOrNoShowAppointments();
}

export async function updatePsychologistPaymentDetailsAction(
    appointmentId: number,
    paidAmount: number | undefined,
    paymentStatus: PaymentStatus | undefined,
    paymentType?: PaymentType | undefined
): Promise<Appointment>
{
  const {updatePaymentDetails} = await serverAppointmentApi();
  return await updatePaymentDetails(appointmentId, paidAmount, paymentStatus, paymentType);
}

// New action function for updating patient payment details


export async function getPartiallyPaidAppointmentsAction(): Promise<Appointment[]>
{
  const {getPartiallyPaidAppointments} = await serverAppointmentApi();
  return await getPartiallyPaidAppointments();
}

export async function getDailyAppointmentsAction(): Promise<Appointment[]>
{
  const {getDailyAppointments} = await serverAppointmentApi();
  return await getDailyAppointments();
}

export async function getAdminAssignedAppointmentsAction(): Promise<Appointment[]>
{
  const {getAdminAssignedAppointments} = await serverAppointmentApi();
  return await getAdminAssignedAppointments();
}

export async function getOwnAppointmentsAction(): Promise<Appointment[]>
{
  const {getOwnAppointments} = await serverAppointmentApi();
  return await getOwnAppointments();
}

export async function getDailyAppointmentsForUserAction(): Promise<Appointment[]>
{
  const {getDailyAppointmentsForUser} = await serverAppointmentApi();
  return await getDailyAppointmentsForUser();
}

export async function getWeeklyAppointmentsForUserAction(): Promise<Appointment[]>
{
  const {getWeeklyAppointmentsForUser} = await serverAppointmentApi();
  return await getWeeklyAppointmentsForUser();
}

export async function getMonthlyAppointmentsForUserAction(): Promise<Appointment[]>
{
  const {getMonthlyAppointmentsForUser} = await serverAppointmentApi();
  return await getMonthlyAppointmentsForUser();
}

export async function getDailyAppointmentsTotalFeeAction(): Promise<number>
{
  const {getDailyAppointmentsTotalFee} = await serverAppointmentApi();
  return await getDailyAppointmentsTotalFee();
}

export async function getWeeklyAppointmentsTotalFeeAction(): Promise<number>
{
  const {getWeeklyAppointmentsTotalFee} = await serverAppointmentApi();
  return await getWeeklyAppointmentsTotalFee();
}

export async function getMonthlyAppointmentsTotalFeeAction(): Promise<number>
{
  const {getMonthlyAppointmentsTotalFee} = await serverAppointmentApi();
  return await getMonthlyAppointmentsTotalFee();
}

export async function getAdminAppointmentsAction(): Promise<Appointment[]>
{
  const {getAdminAppointments} = await serverAppointmentApi();
  return await getAdminAppointments();
}

export async function getAllCompletedAppointment(search: string, date : Date): Promise<Appointment[]>
{
  const {getAllCompletedAppointments} = await serverAppointmentApi();
  return await getAllCompletedAppointments(search?search:"default", date);
}

export async function getNonAdminAppointmentsAction(): Promise<Appointment[]>
{
  const {getNonAdminAppointments} = await serverAppointmentApi();
  return await getNonAdminAppointments();
}

export async function getRoomByDateAndTime(date: Date, time : string): Promise<Appointment[]>
{
  const {getRoomByDateAndTime} = await serverAppointmentApi();
  return await getRoomByDateAndTime(time,date);
}


export async function getPsychologistByDateAndTime(date: Date, time : string): Promise<Appointment[]>
{
  const {getPsychologistByDateAndTime} = await serverAppointmentApi();
  return await getPsychologistByDateAndTime(time,date);
}

