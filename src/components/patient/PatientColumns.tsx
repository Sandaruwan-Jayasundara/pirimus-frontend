"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/ColumnHeader";
import { Patient } from "@/type/patient";
import ClientNotes from "./PatientColumns/ClientNotes";
import PsychologistCol from "./PatientColumns/PsychologistCol";
import Status from "./PatientColumns/Status";

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kimlik" />
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ad" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soyad" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-posta" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefon" />
    ),
  },
  {
    accessorKey: "clientNotes",
    header: () => <div className="text-right">Notlar</div>,
    cell: ({ row }) => <ClientNotes patient={row.original} />,
    
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Durum</div>,
    cell: ({ row }) => <Status patient={row.original} />,
  },
  {
    accessorKey: "psychologist",
    header: () => <div className="text-right">Psikolog</div>,
    cell: ({ row }) => <PsychologistCol patient={row.original} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">İşlemler</div>,
  },
];
