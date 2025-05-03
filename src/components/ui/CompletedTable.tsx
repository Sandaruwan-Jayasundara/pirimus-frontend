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
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/TablePagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Appointment } from "@/type/appointment";

interface CompletedTableProps<TData> {
  title?: string;
  columns: ColumnDef<TData, unknown>[];
  data: TData[] | null;
  search: string;
  setSearch: (value: string) => void;
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
}

export function CompletedTable<TData extends Appointment>({
  title,
  columns,
  data,
  search,
  setSearch,
  selectedDate,
  setSelectedDate,
}: CompletedTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    initialState: {
      columnVisibility: {
        status: false,
        actions: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-full">
      <div className="flex justify-end items-center mt-5 mb-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] text-left">
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(day) => day && setSelectedDate(day)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0  bg-green-100/50 mb-5">
          <h3 className="text-xl font-semibold text-foreground">
            {title ?? "Appointments"}
          </h3>
          <Input
            type="text"
            placeholder="Search appointments..."
            className="w-full sm:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-accent"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end py-4">
          <DataTablePagination table={table} />
        </CardFooter>
      </Card>
    </div>
  );
}
