"use client";
import React, { useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Psychologist } from "@/type/psychologist";

interface PsychologistAvailableTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function PsychologistAvailableTable<TData extends Psychologist, TValue>({
  title,
  columns,
  data: initialData,
}: PsychologistAvailableTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <>
      <div>
        <DataTable title={title} columns={columns} data={data} />
      </div>
    </>
  );
}
