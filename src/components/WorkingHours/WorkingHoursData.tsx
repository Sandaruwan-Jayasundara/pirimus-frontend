"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { WorkingHours } from "@/type/WorkingHours";
import WorkingHoursWithTime from "./WorkingHoursWithTime";
interface Slot {
  id: string | number;
  startTime: string;
  endTime: string;
}

interface DayOfWeek {
  dayOfWeek: string;
  slots?: Slot[];
}

export default function WorkingHoursData({
  workingHours,
}: {
  workingHours: WorkingHours;
}) {
  // Ensure workingHours always has a days array, even if undefined initially
  const initialData: WorkingHours = {
    id: workingHours?.id,
    psychologist: workingHours?.psychologist,
    days: workingHours ? workingHours?.available : [],
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<WorkingHours>(initialData);

  const handleWorkingHoursUpdated = (updatedWorkingHours: WorkingHours) => {
    // Ensure updated data has days property
    const safeUpdatedData: WorkingHours = {
      ...updatedWorkingHours,
      days: updatedWorkingHours.available ?? [],
    };

    setData(safeUpdatedData);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="w-full border rounded-lg shadow-md">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Working Days</h2>
          <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
            {Array.isArray(data?.days) && data.days.length > 0
              ? "Edit Working Days"
              : "Set Working Days"}
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          {Array.isArray(data?.days) && data.days.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                data?.days?.map((day) =>
                  typeof day === "string" ? { dayOfWeek: day, slots: [] } : day
                ) as DayOfWeek[]
              )?.map((day: DayOfWeek) => (
                <div
                  key={day.dayOfWeek}
                  className="border rounded-lg shadow-md p-4 border-r-3 border-r-green-500"
                >
                  <h2 className="text-xl font-semibold">{day.dayOfWeek}</h2>
                  {day.slots && day.slots.length > 0 ? (
                    day.slots.map((slot) => (
                      <div key={slot.id} className="flex items-center">
                        <span className="font-medium">
                          {`${slot.startTime} - ${slot.endTime}`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No slots available</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No working days set. Click `Set Working Days` to add them.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <WorkingHoursWithTime
          initialAvailability={data}
          onAvailabilitySet={handleWorkingHoursUpdated}
        />
      </Dialog>
    </>
  );
}
