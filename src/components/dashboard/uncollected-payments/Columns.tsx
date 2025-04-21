"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Appointment} from "@/type/appointment";
import {Psychologist} from "@/type/psychologist";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "startTime",
    header: ({column}) => <DataTableColumnHeader column={column} title="Date"/>,
    cell: ({row}) => {
      const startTime = row.original.startTime;
      if (!startTime) return "N/A";
      const date = new Date(startTime);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Date(startTime).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
  },
  {
    id: "timeRange",
    header: ({column}) => <DataTableColumnHeader column={column} title="Time"/>,
    cell: ({row}) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      if (!startTime || !endTime) return "N/A";
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "Invalid Time";
      const startFormatted = startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      });
      const endFormatted = endDate.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hourCycle: "h23"});
      return `${startFormatted} - ${endFormatted}`;
    },
  },
  {
    accessorKey: "psychologist",
    header: ({column}) => <DataTableColumnHeader column={column} title="Psychologist Name"/>,
    cell: ({row}) => {
      const appointment = row.original;
      const psychologist: Psychologist | undefined = appointment.psychologist;
      return `${psychologist?.firstName || ""} ${psychologist?.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "patient",
    header: ({column}) => <DataTableColumnHeader column={column} title="Client Name"/>,
    cell: ({row}) => {
      const appointment = row.original;
      return `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "totalFee",
    header: ({column}) => <DataTableColumnHeader column={column} title="Total Amount"/>,
    cell: ({row}) => {
      const totalFee = row.original.totalFee;
      return `₺${(totalFee ?? 0).toFixed(2)}`;
    },
  },
  {
    accessorKey: "remainingAmount",
    header: ({column}) => <DataTableColumnHeader column={column} title="Remaining Amount"/>,
    cell: ({row}) => {
      const remainingAmount = row.original.remainingAmount;
      return `₺${(remainingAmount ?? 0).toFixed(2)}`;
    },
  },
  {
    accessorKey: "branchName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Branch Name"/>,
    cell: ({row}) => row.original.branchName || "N/A",
  },
  {
    accessorKey: "roomName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Room Name"/>,
    cell: ({row}) => row.original.roomName || "N/A",
  },
];