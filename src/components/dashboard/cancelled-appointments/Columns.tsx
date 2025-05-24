"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Appointment} from "@/type/appointment";
import {Psychologist} from "@/type/psychologist";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "startTime",
    header: ({column}) => <DataTableColumnHeader column={column} title="Tarih"/>,
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
    header: ({column}) => <DataTableColumnHeader column={column} title="Saat"/>,
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
    header: ({column}) => <DataTableColumnHeader column={column} title="Psikolog Adı"/>,
    cell: ({row}) => {
      const appointment = row.original;
      const psychologist: Psychologist | undefined = appointment.psychologist;
      return `${psychologist?.firstName || ""} ${psychologist?.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "patient",
    header: ({column}) => <DataTableColumnHeader column={column} title="Danışan Adı"/>,
    cell: ({row}) => {
      const appointment = row.original;
      return `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "roomName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Oda Adı"/>,
    cell: ({row}) => row.original.roomName || "N/A",
  },
  {
    accessorKey: "branchName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Şube Adı"/>,
    cell: ({row}) => row.original.branchName || "N/A",
  },

];