// File: @/components/psychologist-dashboard/SessionTrackingList.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/type/appointment";
import {
  getDailyAppointmentsForUserAction,
  getWeeklyAppointmentsForUserAction,
  getMonthlyAppointmentsForUserAction,
} from "@/api/AppointmentApi";

export default function SessionTrackingList() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Function to fetch appointments based on period
    const fetchAppointments = async (
      selectedPeriod: "daily" | "weekly" | "monthly"
    ) => {
      try {
        let data: Appointment[] = [];
        switch (selectedPeriod) {
          case "daily":
            data = await getDailyAppointmentsForUserAction();
            break;
          case "weekly":
            data = await getWeeklyAppointmentsForUserAction();
            break;
          case "monthly":
            data = await getMonthlyAppointmentsForUserAction();
            break;
        }
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    };
    fetchAppointments(period);
  }, [period]);

  // Handle dropdown selection
  const handlePeriodChange = (newPeriod: "daily" | "weekly" | "monthly") => {
    setPeriod(newPeriod);
  };

  return (
    <div className="rounded-lg border p-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Session Tracking List</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-green-500">
              {period.charAt(0).toUpperCase() + period.slice(1)}{" "}
              <span className="ml-2">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handlePeriodChange("daily")}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePeriodChange("weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePeriodChange("monthly")}>
              Monthly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Listing for {period} appointments
      </p>
      <Table className="text-xs mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Room Name</TableHead>
            <TableHead>Branch Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="text-foreground text-xs sm:text-sm">
                  {`${session.patient?.firstName} ${session.patient?.lastName}` ||
                    "Unknown"}
                </TableCell>
                <TableCell className="text-foreground text-xs sm:text-sm">{`${new Date(
                  session.startTime
                ).toLocaleTimeString()} - ${new Date(
                  session.endTime
                ).toLocaleTimeString()}`}</TableCell>
                <TableCell className="text-foreground text-xs sm:text-sm">
                  {session.roomName}
                </TableCell>
                <TableCell className="text-foreground text-xs sm:text-sm">
                  {session.branchName}
                </TableCell>
                <TableCell className="text-green-600 text-xs sm:text-sm font-bold px-2 py-1 rounded">
                  {session.status}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-xs sm:text-sm">
                No appointments found for this period.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
