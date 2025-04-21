// File: DailyAppointmentList.tsx
import DailyAppointmentList from '@/components/psychologist-dashboard/DailyAppointmentList';
import {getAdminAssignedAppointmentsAction, getOwnAppointmentsAction} from "@/api/AppointmentApi";

export default async function AppointmentListData() {
  const adminAppointments = await getAdminAssignedAppointmentsAction();
  const psychologistAppointments = await getOwnAppointmentsAction();
  return (
      <DailyAppointmentList
          adminAppointments={adminAppointments}
          psychologistAppointments={psychologistAppointments}
      />
  );
}