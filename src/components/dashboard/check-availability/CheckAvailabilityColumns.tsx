"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import { Room } from "@/type/room";
import ViewTimeSlotsDialog from "@/components/room/admin/ViewTimeSlots";

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "name",
    header: ({column}) => <DataTableColumnHeader column={column} title="İsim"/>,
  },
  {
    accessorKey: "floorNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Kat"/>,
  },
  {
    accessorKey: "hourlyRate",
    header: ({column}) => <DataTableColumnHeader column={column} title="Saatlik Ücret"/>,
  },
  {
    accessorKey: "branch.name",
    header: ({column}) => <DataTableColumnHeader column={column} title="Şube Adı"/>,
  },
  {
    accessorKey: "branch.contactNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="İletişim Numarası"/>,
  },
  
  {
    id: "viewSlots",
    header: () => <div className="text-center">Uygunluk</div>,
    cell: ({row}) => {
      const room = row.original;
      return (
          <div className="text-center">
            <ViewTimeSlotsDialog availability={room.availability}/>
          </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({column}) => <DataTableColumnHeader column={column} title="Oda Durumu"/>,
  },
  {
    accessorKey: "psyAvailability",
    header: ({column}) => <DataTableColumnHeader column={column} title="Psikolog Durumu"/>,
  }

];