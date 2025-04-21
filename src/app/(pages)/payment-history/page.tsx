import {PaymentHistoryTable} from "@/components/room/psychologist/PaymentHistoryTable";
import ProtectedRoute from "@/context/ProtectedRoute";
import {Role} from "@/type/role";

export default async function PaymentHistory() {

  return (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <PaymentHistoryTable/>
      </ProtectedRoute>
  );
}