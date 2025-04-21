"use client";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/ColumnHeader";
import {Branch} from "@/type/branch";

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "id",
    header: ({column}) => <DataTableColumnHeader column={column} title="ID"/>,
  },
  {
    accessorKey: "name",
    header: ({column}) => <DataTableColumnHeader column={column} title="Name"/>,
  },
  {
    accessorKey: "totalFloor",
    header: ({column}) => <DataTableColumnHeader column={column} title="Total Floors"/>,
  },
  {
    accessorKey: "totalRooms",
    header: ({column}) => <DataTableColumnHeader column={column} title="Total Rooms"/>,
  },
  {
    accessorKey: "contactNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="Contact Number"/>,
  },
  {
    accessorKey: "email",
    header: ({column}) => <DataTableColumnHeader column={column} title="Email"/>,
  },
  {
    accessorKey: "address",
    header: ({column}) => <DataTableColumnHeader column={column} title="Address"/>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
  },
];