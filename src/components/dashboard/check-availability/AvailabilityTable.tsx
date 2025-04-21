// RoomTable.tsx
"use client";
import React, { useEffect } from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Room} from "@/type/room";
import { AvailabilityRoomTable } from "@/components/ui/AvailabilityRoomTable";

interface AvailabilityTableWrapperProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: object[];
}
export function AvailabilityTable<TData extends Room, TValue>({
  title,
  columns,
  data: initialData,
}: AvailabilityTableWrapperProps<TData, TValue>) 
{
  const [data, setData] = React.useState<object[]>(initialData);


useEffect(()=>{
  setData(initialData);
},[initialData])


  return (
           <AvailabilityRoomTable<TData & { psyAvailability?: string }, TValue>
            title={title}
            columns={columns}
            data={data as TData[]}
        />


  );
}