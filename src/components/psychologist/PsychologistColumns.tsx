"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Psychologist} from "@/type/psychologist";
import ViewEarningsDialog from "@/components/psychologist/ViewEarningDialog";
import ViewPatientsList from "./ViewPatientsList";
import Status from "./PsychologistColumns/Status";
import ApplyBlockTiming from "./PsychologistColumns/ApplyBlockTiming";

export const columns: ColumnDef<Psychologist>[] = [
  {
    accessorKey: "firstName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Ad"/>,
  },
  {
    accessorKey: "lastName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Soyad"/>,
  },
  {
    accessorKey: "email",
    header: ({column}) => <DataTableColumnHeader column={column} title="E-posta"/>,
  },
  {
    accessorKey: "phoneNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Telefon"/>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Durum</div>,
    cell: ({ row }) => <Status psychologist={row.original} />,
  },
  {
    accessorKey: "applyBlockTiming",
    header: () => <div className="text-right">Çalışma Saatleri</div>,
    cell: ({ row }) => <ApplyBlockTiming psychologist={row.original} />,

  },
  {
    accessorKey: "earnings",
    header: () => <div className="text-right">Kazançlar</div>,
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
    header: () => <div className="text-right">Hastalar</div>,
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
    header: () => <div className="text-right">İşlemler</div>,
  },
];