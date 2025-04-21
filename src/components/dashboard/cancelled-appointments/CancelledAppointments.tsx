import {getCancelledOrNoShowAppointmentsAction} from "@/api/AppointmentApi";
import {columns} from "@/components/dashboard/cancelled-appointments/Columns"; // New file for columns (see below)
import {AppointmentTable} from "@/components/appointment/AppointmentTable";

export async function CancelledAppointments()
{
  const cancelledAppointments = await getCancelledOrNoShowAppointmentsAction();
  return (
      <div className="space-y-4">
        <AppointmentTable
            columns={columns}
            data={cancelledAppointments}
            showAddButton={false}
        />
      </div>
  );
}