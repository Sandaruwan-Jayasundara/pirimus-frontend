"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { getWorkingHoursByIdAction } from "@/api/WorkingHoursApi";
import { WorkingHours } from "@/type/WorkingHours";

interface ViewAvailabilityWorkingHoursDialogProps {
  psychologistId: number;
}

const daysOfWeekOrdered = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const ViewAvailabilityWorkingHoursDialog: React.FC<ViewAvailabilityWorkingHoursDialogProps> = ({
  psychologistId,
}) => {
  const [workingHours, setWorkingHours] = useState<WorkingHours[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !workingHours) {
      const fetchWorkingHours = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getWorkingHoursByIdAction(psychologistId);
          setWorkingHours(data[0].available as WorkingHours[]);
        } catch (err) {
          setError("Failed to fetch working hours. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkingHours();
    }
  }, [isOpen, psychologistId, workingHours]);

  const getSlotsForDay = (day: string) => {
    return workingHours?.find((d) => d.dayOfWeek === day)?.slots || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Hours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Psychologist Availability</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : workingHours && workingHours?.length > 0 ? (
            <div className="grid grid-cols-7 gap-4 text-sm border rounded-lg p-4 bg-gray-50">
              {daysOfWeekOrdered.map((day) => (
                <div key={day} className="flex flex-col items-start">
                  <div className="font-medium text-center w-full border-b pb-1 mb-1">
                    {day}
                  </div>
                    {getSlotsForDay(day).length > 0 ? (
                    getSlotsForDay(day).map((slot: { id?: string; startTime: string; endTime: string }, index: number) => (
                      <div
                      key={slot.id ?? index}
                      className="bg-green-100 text-green-800 rounded px-2 py-1 mb-1 text-xs w-full text-center"
                      >
                      {slot.startTime} - {slot.endTime}
                      </div>
                    ))
                    ) : (
                    <div className="text-muted-foreground text-xs mt-2 w-full text-center">
                      No slots
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No working days set</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAvailabilityWorkingHoursDialog;
