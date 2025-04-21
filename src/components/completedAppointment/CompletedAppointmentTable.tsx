"use client";
import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/type/appointment";
import {
  getAllCompletedAppointment
} from "@/api/AppointmentApi";
import { CompletedTable } from "../ui/CompletedTable";

interface CompletedAppointmentTableProps {
  title?: string;
  columns: ColumnDef<Appointment, unknown>[];
}

export function CompletedAppointmentTable({
  title,
  columns
}: CompletedAppointmentTableProps) {
  const [data, setData] = useState<Appointment[] | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  useEffect(() => {
    const fetchPatients = async (search: string, selectedDate: Date) => {
      try {
        const completedAppointments = await getAllCompletedAppointment(search, selectedDate);
      
        setData(completedAppointments);
      } catch {
        setData(null);
      }
    };
      fetchPatients(search, selectedDate);
  }, [search,title, selectedDate]);

  return (
    <>
      <CompletedTable
        title={title}
        columns={columns}
        data={data}
        search={search}
        setSearch={setSearch}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </>
  );
}
