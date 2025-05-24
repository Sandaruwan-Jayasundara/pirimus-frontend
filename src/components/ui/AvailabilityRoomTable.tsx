"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/TablePagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface AvailabilityRoomTableProps<TData extends { psyAvailability?: string }, TValue> {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AvailabilityRoomTable<TData extends { psyAvailability?: string }, TValue>({
  title,
  columns,
  data,
}: AvailabilityRoomTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });


  return (
    <div className="w-full">
      <Card className="shadow-md ">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between sm:space-x-4 space-y-4 sm:space-y-0 w-full">
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground flex-1 text-center md:text-start">
            {title}
          </h3>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border">
            <Table className="text-xs sm:text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-foreground">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length > 0 ? (
                  table.getRowModel().rows.map((row) => {
                    const isInitial =
                      row.original.psyAvailability === "initial";

                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-accent"
                      >
                        {isInitial ? (
                          <TableCell
                            colSpan={columns.length}
                            className="text-center text-blue-500 font-semibold text-xs sm:text-sm bg-blue-50"
                          >
                            Müsaitliği Kontrol Etmek İçin Ara

                          </TableCell>
                        ) : (
                          row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={`text-xs sm:text-sm ${cell.column.id === "status"
                                  ? cell.getValue() === "OCCUPIED"
                                    ? "text-red-500 font-bold border bg-red-100 py-0"
                                    : "text-green-500 font-bold border bg-green-100 py-0"
                                  : cell.column.id === "psyAvailability"
                                    ? cell.getValue() === "AVAILABLE"
                                      ? "text-green-500 font-bold border bg-green-100 py-0"
                                      : "text-red-500 font-bold border bg-red-100 py-0"
                                    : "text-foreground"
                                }`}
                            >
                              {cell.column.id === "status" &&
                                cell.getValue() === "OCCUPIED"
                                ? "Unavailable"
                                : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                            </TableCell>
                          ))
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground text-xs sm:text-sm text-red-500 font-bold border bg-red-100 py-0"
                    >
                      Unavailable
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center md:justify-end py-4">
          <DataTablePagination table={table} />
        </CardFooter>
      </Card>
    </div>
  );
}
