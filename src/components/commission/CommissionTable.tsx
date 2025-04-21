"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { CommissionDto } from "@/type/commission";
import {
  pendingColumns,
  paidColumns,
} from "@/components/commission/CommissionColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCommissionStatusAction } from "@/api/CommissionApi";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/type/role";

interface CommissionTableProps<TData extends CommissionDto> {
  title: string;
  data: TData[];
  tab: "pending" | "paid";
}

export function CommissionTable<TData extends CommissionDto, TValue>({
  title,
  data: initialData,
  tab,
}: CommissionTableProps<TData>) {
  const [data, setData] = useState<TData[]>(initialData);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleStatusChange = async (
    commissionId: number,
    newStatus: "PENDING" | "PAID"
  ) => {
    try {
      setLoadingId(commissionId);
      const updatedCommission = await updateCommissionStatusAction(
        commissionId,
        newStatus
      );

      setData((prev) =>
        prev.map((commission) =>
          commission.commissionId === commissionId
            ? { ...commission, ...updatedCommission }
            : commission
        )
      );
    } catch (error) {
      console.error("Error updating commission status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  // Base columns based on tab
  const baseColumns: ColumnDef<TData, TValue>[] =
    tab === "pending"
      ? (pendingColumns as ColumnDef<TData, TValue>[])
      : (paidColumns as ColumnDef<TData, TValue>[]);

  // Modify the status column for the "pending" tab if user is ADMIN
  const modifiedColumns: ColumnDef<TData, TValue>[] = baseColumns.map((col) =>
    col.id === "status" && tab === "pending" && user?.role === Role.ADMIN
      ? {
          ...col,
          id: "status", // Explicitly set id to ensure consistency
          cell: ({ row }) => {
            const commission = row.original;
            const isLoading = loadingId === commission.commissionId;

            return (
              <Select
                value={commission.status}
                onValueChange={(value) =>
                  handleStatusChange(
                    commission.commissionId,
                    value as "PENDING" | "PAID"
                  )
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue>
                    {isLoading ? "Updating..." : commission.status}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            );
          },
        }
      : col
  );

  // Filter out the status column if the user is not an admin
  const finalColumns: ColumnDef<TData, TValue>[] =
    user?.role !== Role.ADMIN
      ? modifiedColumns.filter((col) => col.id !== "status")
      : modifiedColumns;

  return (
    <DataTable
      title={title}
      columns={finalColumns}
      data={data}
      showAddButton={false}
    />
  );
}
