"use client";
import ProtectedRoute from "@/context/ProtectedRoute";
import { Role } from "@/type/role";
import { PaymentRecordTable } from "@/components/room/psychologist/PaymentRecordTable";

export default function PaymentHistory() {
  return (
    <ProtectedRoute allowedRoles={[Role.PSYCHOLOGIST]}>
        <PaymentRecordTable/>
    </ProtectedRoute>
  );
}
