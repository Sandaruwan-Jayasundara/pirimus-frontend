import {getDailyAppointmentsAction} from "@/api/AppointmentApi";
import {columns} from "@/components/dashboard/daily-appointment/Columns"; // New file for columns (see below)
import {AppointmentTable} from "@/components/appointment/AppointmentTable";

export async function DailyAppointments()
{
  const dailyAppointments = await getDailyAppointmentsAction();
  return (
      <div className="space-y-4">
        <AppointmentTable
            columns={columns}
            data={dailyAppointments}
            showAddButton={false}
        />
      </div>
  );
}