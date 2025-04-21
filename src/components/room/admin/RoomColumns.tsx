"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Room} from "@/type/room";
import ViewTimeSlotsDialog from "@/components/room/admin/ViewTimeSlots";

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "id",
    header: ({column}) => <DataTableColumnHeader column={column} title="ID"/>,
  },
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
    cell: ({row}) => `₺${row.original.hourlyRate.toFixed(2)}`,
  },
  {
    accessorKey: "cancellationPeriod",
    header: ({column}) => <DataTableColumnHeader column={column} title="Cancellation Period"/>,
  },
  {
    accessorKey: "branch.name",
    header: ({column}) => <DataTableColumnHeader column={column} title="Branch Name"/>,
  },
  {
    accessorKey: "branch.address",
    header: ({column}) => <DataTableColumnHeader column={column} title="Branch Address"/>,
  },
  {
    accessorKey: "branch.contactNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Branch Contact"/>,
  },
  {
    accessorKey: "branch.email",
    header: ({column}) => <DataTableColumnHeader column={column} title="Branch Email"/>,
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
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
  },
];