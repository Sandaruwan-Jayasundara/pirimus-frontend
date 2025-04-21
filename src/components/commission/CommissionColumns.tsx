// @/components/commission/CommissionColumns.tsx
"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {CommissionDto} from "@/type/commission";
import {format} from "date-fns";

const baseColumns: ColumnDef<CommissionDto>[] = [
  {
    accessorKey: "commissionId", // Corrected to accessorKey
    header: ({column}) => <DataTableColumnHeader column={column} title="ID"/>,
  },
  {
    id: "appointmentTime", // Custom column, so use `id`
    header: ({column}) => <DataTableColumnHeader column={column} title="Appointment Time"/>,
    cell: ({row}) => {
      const startTime = row.original.appointmentStartTime
          ? format(new Date(row.original.appointmentStartTime), "PPP HH:mm")
          : "N/A";
      const endTime = row.original.appointmentEndTime
          ? format(new Date(row.original.appointmentEndTime), "HH:mm")
          : "N/A";
      return `${startTime} - ${endTime}`;
    },
  },
  {
    accessorKey: "psychologistName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Psychologist Name"/>,
  },
  {
    accessorKey: "commissionAmount",
    header: ({column}) => <DataTableColumnHeader column={column} title="Commission Amount"/>,
    cell: ({row}) => `₺${row.original.commissionAmount.toFixed(2)}`,
  },
  {
    accessorKey: "patientName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Patient Name"/>,
  },
];

export const pendingColumns: ColumnDef<CommissionDto>[] = [
  ...baseColumns,
  {
    id: "status",
    header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
    // Cell will be overridden in CommissionTable.tsx
    cell: ({row}) => row.original.status,
  },
];

export const paidColumns: ColumnDef<CommissionDto>[] = [
  ...baseColumns,
  {
    id: "status",
    header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
    cell: ({row}) => row.original.status,
  },
];