"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Psychologist} from "@/type/psychologist";
import ViewAvailabilityWorkingHoursDialog from "./ViewAvailabilityWorkingHours";

export const columns: ColumnDef<Psychologist>[] = [
  {
    accessorKey: "firstName",
    header: ({column}) => <DataTableColumnHeader column={column} title="İsim"/>,
  },
  {
    accessorKey: "lastName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Soyisim"/>,
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
    accessorKey: "workingHours",
    header: () => <div className="text-right">Çalışma Saatleri</div>,
    cell: ({row}) => {
      const psychologist = row.original;
      return (
          <div className="text-right">
            <ViewAvailabilityWorkingHoursDialog psychologistId={psychologist.id}/>
          </div>
      );
    },
  }

];