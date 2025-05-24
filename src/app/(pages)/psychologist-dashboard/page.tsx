// File: @/app/psychologist-dashboard/page.tsx
// import AppointmentCalendar from "@/components/psychologist-dashboard/AppointmentCalender";
import SessionTrackingList from "@/components/psychologist-dashboard/SessionTrackingList";
import AppointmentListData from "@/components/psychologist-dashboard/AppointmentListData";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";

export default async function Dashboard() {
  return (
      <ProtectedRoute allowedRoles={[Role.PSYCHOLOGIST]}>
      <div className="space-y-6 mt-5">
        <h1 className="text-2xl font-bold">Gösterge Paneli</h1>
        <hr/>
        <div className="grid grid-cols-1 ">
          {/* <AppointmentCalendar/> */}
          <SessionTrackingList/>
        </div>
        <AppointmentListData/>
      </div>
      </ProtectedRoute>
  );
}