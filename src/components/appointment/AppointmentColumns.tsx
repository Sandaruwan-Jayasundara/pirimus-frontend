"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/ColumnHeader";
import {
  Appointment,
} from "@/type/appointment";
import { format } from "date-fns";
import StatusCell from "./TableColumns/StatusCell";
import PsychologistCell from "./TableColumns/PsychologistCell";
import PsychologistPaymentCell from "./TableColumns/PsychologistPaymentCell";
import ClientPaymentCell from "./TableColumns/ClientPaymentCell";
import MessageStatusCell from "./TableColumns/MessageStatusCell";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tarih" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Saat" />
    ),
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      if (!startTime || !endTime) return "N/A";
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
        return "Invalid Time";
      const startFormatted = format(startDate, "HH:mm");
      const endFormatted = format(endDate, "HH:mm");
      return `${startFormatted} - ${endFormatted}`;
    },
  },
  {
    accessorKey: "patient",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Müşteri Adı" />
    ),
    cell: ({ row }) => {
      const appointment = row.original;
      return `${appointment.patient?.firstName} ${appointment.patient?.lastName}`;
    },
  },
  {
    accessorKey: "branchName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Şube" />
    ),
    cell: ({ row }) => row.original.branchName || "N/A",
  },
  {
    accessorKey: "roomName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Oda Adı" />
    ),
    cell: ({ row }) => row.original.roomName,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Durum</div>,
    cell: ({ row }) => <StatusCell appointment={row.original} />,
  },
  {
    accessorKey: "psychologist",
    header: () => <div className="text-right">Psikolog</div>,
    cell: ({ row }) => <PsychologistCell appointment={row.original} />,
  },
  {
    id: "psychologistPayment",
    header: () => <div className="text-right">Psikolog Ödemesi</div>,
    cell: ({ row }) => <PsychologistPaymentCell appointment={row.original} />,
  },
  {
    id: "clientPayment",
    header: () => <div className="text-right">Müşteri Ödemesi</div>,
    cell: ({ row }) => <ClientPaymentCell appointment={row.original} />,
  },
  {
    id: "messageStatus",
    header: () => <div className="text-right">Mesaj Durumu</div>,
    cell: ({ row }) => <MessageStatusCell appointment={row.original} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">İşlemler</div>,
  },
];
