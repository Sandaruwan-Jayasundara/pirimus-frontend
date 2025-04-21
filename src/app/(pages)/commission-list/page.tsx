// @/app/commissions/page.tsx
"use client";
import ProtectedRoute from "@/context/ProtectedRoute";
import { Role } from "@/type/role"; // Adjust path
import { PaymentHistoryTable } from "@/components/room/psychologist/PaymentHistoryTable";


export default function CommissionPage() {
  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.PSYCHOLOGIST]}>
      <PaymentHistoryTable />
    </ProtectedRoute>
  );
}
