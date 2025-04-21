"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import { Room } from "@/type/room";
import ViewTimeSlotsDialog from "@/components/room/admin/ViewTimeSlots";

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "name",
    header: ({column}) => <DataTableColumnHeader column={column} title="Name"/>,
  },
  {
    accessorKey: "floorNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Floor"/>,
  },
  {
    accessorKey: "hourlyRate",
    header: ({column}) => <DataTableColumnHeader column={column} title="Hourly Rate"/>,
  },
  {
    accessorKey: "branch.name",
    header: ({column}) => <DataTableColumnHeader column={column} title="Branch"/>,
  },
  {
    accessorKey: "branch.contactNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Contact Number"/>,
  },
  
  {
    id: "viewSlots",
    header: () => <div className="text-center">Availability</div>,
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
    header: ({column}) => <DataTableColumnHeader column={column} title="Room Status"/>,
  },
  {
    accessorKey: "psyAvailability",
    header: ({column}) => <DataTableColumnHeader column={column} title="Psychologist Status"/>,
  }

];