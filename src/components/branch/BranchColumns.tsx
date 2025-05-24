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
    header: ({column}) => <DataTableColumnHeader column={column} title="İsim"/>,
  },
  {
    accessorKey: "totalFloor",
    header: ({column}) => <DataTableColumnHeader column={column} title="Toplam Kat"/>,
  },
  {
    accessorKey: "totalRooms",
    header: ({column}) => <DataTableColumnHeader column={column} title="Toplam Oda"/>,
  },
  {
    accessorKey: "contactNumber",
    header: ({column}) => <DataTableColumnHeader column={column} title="İletişim Numarası"/>,
  },
  {
    accessorKey: "email",
    header: ({column}) => <DataTableColumnHeader column={column} title="E-posta"/>,
  },
  {
    accessorKey: "address",
    header: ({column}) => <DataTableColumnHeader column={column} title="Adres"/>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">İşlemler</div>,
  },
];