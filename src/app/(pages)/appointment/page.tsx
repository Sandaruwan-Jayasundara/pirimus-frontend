import { AppointmentTableTabs } from "@/components/appointment/AppointmentTableTabs";
import {
  getAdminAppointmentsAction,
  getNonAdminAppointmentsAction,
} from "@/api/AppointmentApi";
import { Role } from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";

export default async function Appointments() {
  const adminAppointments = await getAdminAppointmentsAction();
  const nonAdminAppointments = await getNonAdminAppointmentsAction();

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.PSYCHOLOGIST]}>
      <AppointmentTableTabs
        adminAppointments={adminAppointments}
        nonAdminAppointments={nonAdminAppointments}
      />
    </ProtectedRoute>
  );
}
