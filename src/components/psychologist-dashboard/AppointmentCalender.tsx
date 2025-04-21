'use client';
import {Calendar} from "@/components/ui/calendar";
import {useState} from "react";

export default function AppointmentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Room and Client Appointment Calendar</h2>
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mt-4"
        />
      </div>
  );
}