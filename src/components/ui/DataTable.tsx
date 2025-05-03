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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DataTableProps<TData extends { startTime?: string; status?: string }, TValue> {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showAddButton?: boolean;
  onAddClick?: () => void; // Handler for add button click
  isFilter?: boolean; // Optional prop to determine if filter is needed
}

export function DataTable<TData extends { startTime?: string; status?: string }, TValue>({
  title,
  columns,
  data,
  showAddButton = false,
  onAddClick,
  isFilter = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = React.useState("Today");

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
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between sm:space-x-4 space-y-4 sm:space-y-0 w-full bg-green-100/50 mb-5">
          <h3 className="text-xl sm:text-xl font-semibold text-foreground flex-1 text-center md:text-start">
            {title}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto mt-4">
            {isFilter && (
              <div className="mb-4 sm:mb-0 sm:mr-5 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border rounded w-full sm:w-auto"
                >
                  <option value="Today">Today</option>
                  <option value="All">All</option>
                  <option value="Schedule">Schedule</option>
                </select>
              </div>
            )}

            {showAddButton && (
              <Button
                variant="outline"
                onClick={onAddClick}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 text-primary" /> Add
              </Button>
            )}
          </div>
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
                {table.getRowModel().rows?.length ? (
                  isFilter ? (
                    <>
                      {table
                        .getRowModel()
                        .rows.filter((row) => {
                          const status = row.original?.status;
                          const startTime = row.original?.startTime;

                          if (statusFilter === "All") return true;
                          if (statusFilter === "Completed")
                            return status === "COMPLETED";
                          if (statusFilter === "Schedule")
                            return status === "SCHEDULED";
                          if (statusFilter === "Today") {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];
                            const rowDate = startTime ? new Date(startTime).toISOString().split("T")[0] : null;
                            return rowDate === today;
                          }

                          return true;
                        })
                        .map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="hover:bg-accent"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                className="text-foreground text-xs sm:text-sm"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                    </>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-accent"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="text-foreground text-xs sm:text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground text-xs sm:text-sm"
                    >
                      No results.
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
