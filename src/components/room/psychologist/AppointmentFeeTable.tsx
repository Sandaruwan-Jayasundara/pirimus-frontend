"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/ColumnHeader";
import { Appointment } from "@/type/appointment";
import { DataTable } from "@/components/ui/DataTable";
import { format } from "date-fns";

interface AppointmentFeeTableProps {
  data: Appointment[];
}

export const appointmentFeeColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "startTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      if (!startTime) return "N/A";
      const date = new Date(startTime);
      if (isNaN(date.getTime())) return "Invalid Date";
      return format(date, "PPP");
    },
  },
  {
    id: "timeRange",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      if (!startTime || !endTime) return "N/A";
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "Invalid Time";
      const startFormatted = format(startDate, "HH:mm");
      const endFormatted = format(endDate, "HH:mm");
      return `${startFormatted} - ${endFormatted}`;
    },
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client Name" />,
    cell: ({ row }) => {
      const appointment = row.original;
      return `${appointment.patient?.firstName} ${appointment.patient?.lastName}`;
    },
  },
  {
    accessorKey: "roomName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Room Name" />,
    cell: ({ row }) => row.original.roomName || "N/A",
  },
  {
    accessorKey: "branchName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Branch Name" />,
    cell: ({ row }) => row.original.branchName || "N/A",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => row.original.status || "N/A",
  },
  {
    accessorKey: "totalFee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
    cell: ({ row }) => `₺${row.original.totalFee?.toFixed(2) || '0.00'}`,
  },
  {
    accessorKey: "remainingAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remaining Amount" />,
    cell: ({ row }) => `₺${row.original.remainingAmount?.toFixed(2) || '0.00'}`,
  },
];

export function AppointmentFeeTable({ data }: AppointmentFeeTableProps) {
  return (
    <DataTable
      title="Room & Appointment Fees"
      columns={appointmentFeeColumns}
      data={data}
      showAddButton={false}
    />
  );
}