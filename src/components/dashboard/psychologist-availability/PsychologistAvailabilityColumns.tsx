"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Psychologist} from "@/type/psychologist";
import ViewAvailabilityWorkingHoursDialog from "./ViewAvailabilityWorkingHours";

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
            <ViewAvailabilityWorkingHoursDialog psychologistId={psychologist.id}/>
          </div>
      );
    },
  }

];