import {getPartiallyPaidAppointmentsAction} from "@/api/AppointmentApi";
import {columns} from "@/components/dashboard/uncollected-payments/Columns"; // New file for columns (see below)
import {AppointmentTable} from "@/components/appointment/AppointmentTable";

export async function UncollectedAppointments()
{
  const partiallyPaidAppointments = await getPartiallyPaidAppointmentsAction();
  return (
      <div className="space-y-4">
        <AppointmentTable
            columns={columns}
            data={partiallyPaidAppointments}
            showAddButton={false}
        />
      </div>
  );
}