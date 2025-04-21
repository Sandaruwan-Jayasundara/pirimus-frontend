import { Role } from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";
import { CompletedAppointmentTable } from "@/components/completedAppointment/CompletedAppointmentTable";
import {columns} from "@/components/appointment/AppointmentColumns";

export default async function Appointments() {
  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.PSYCHOLOGIST]}>
        <CompletedAppointmentTable
                title="Completed Appointments"
                columns={columns}
            />
    </ProtectedRoute>
  );
}
