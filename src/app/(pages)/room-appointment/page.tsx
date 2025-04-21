import {RoomManagementTabs} from "@/components/room/psychologist/RoomManagementTabs";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";

export default async function PaymentDashboard() {

  return (
      <ProtectedRoute allowedRoles={[Role.PSYCHOLOGIST]}>
        <div>
          <RoomManagementTabs/>
        </div>
      </ProtectedRoute>
  );
}