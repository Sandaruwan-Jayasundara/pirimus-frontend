"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Psychologist} from "@/type/psychologist";
import ViewWorkingHoursDialog from "@/components/psychologist/ViewWorkingHours";
import ViewEarningsDialog from "@/components/psychologist/ViewEarningDialog";
import ViewPatientsList from "./ViewPatientsList";
import Status from "./PsychologistColumns/Status";
import ApplyBlockTiming from "./PsychologistColumns/ApplyBlockTiming";

export const columns: ColumnDef<Psychologist>[] = [
  {
    accessorKey: "firstName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Name"/>,
  },
  {
    accessorKey: "lastName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Surname"/>,
  },
  {
    accessorKey: "email",
    header: ({column}) => <DataTableColumnHeader column={column} title="Email"/>,
  },
  {
    accessorKey: "phoneNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Phone"/>,
  },
  {
    accessorKey: "workingHours",
    header: () => <div className="text-right">Working Hours</div>,
    cell: ({row}) => {
      const psychologist = row.original;
      return (
          <div className="text-right">
            <ViewWorkingHoursDialog psychologistId={psychologist.id}/>
          </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => <Status psychologist={row.original} />,
  },
  {
    accessorKey: "applyBlockTiming",
    header: () => <div className="text-right">Apply Block Time</div>,
    cell: ({ row }) => <ApplyBlockTiming psychologist={row.original} />,

  },
  {
    accessorKey: "earnings",
    header: () => <div className="text-right">Earnings</div>,
    cell: ({row}) => {
      const psychologist = row.original;
      return (
          <div className="text-right">
            <ViewEarningsDialog psychologistId={psychologist.id}/>
          </div>
      );
    },
  },
  {
    accessorKey: "patients",
    header: () => <div className="text-right">Patients</div>,
    cell: ({row}) => {
      const psychologist = row.original;
      return (
          <div className="text-right">
            <ViewPatientsList psychologistId={psychologist.id}/>
          </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
  },
];