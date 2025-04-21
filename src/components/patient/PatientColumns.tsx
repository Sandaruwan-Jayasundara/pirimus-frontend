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
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "clientNotes",
    header: () => <div className="text-right">Notes</div>,
    cell: ({ row }) => <ClientNotes patient={row.original} />,
    
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => <Status patient={row.original} />,
  },
  {
    accessorKey: "psychologist",
    header: () => <div className="text-right">Psychologist</div>,
    cell: ({ row }) => <PsychologistCol patient={row.original} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
  },
];
