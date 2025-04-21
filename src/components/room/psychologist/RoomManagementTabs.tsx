"use client";
import React, { useEffect, useState } from "react";
import {
  getPaidCommissionsAction,
  getPendingCommissionsAction,
} from "@/api/CommissionApi";
import { CommissionTable } from "@/components/commission/CommissionTable";
import { CommissionDto } from "@/type/commission";

export function RoomManagementTabs() {
  const [roomCommission, setRoomCommission] = useState<CommissionDto[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const pendingCommissions = await getPendingCommissionsAction();
      const paidCommissions = await getPaidCommissionsAction();

      // Combine the arrays
      const combinedCommissions = [...pendingCommissions, ...paidCommissions];

      // Set the combined data
      setRoomCommission(combinedCommissions);
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-4">
      <CommissionTable
        title={"Room fee for Appointment"}
        data={roomCommission}
        tab="pending"
      />
    </div>
  );
}
