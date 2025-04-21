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
import { Availability } from "@/type/room";

interface ViewWorkingHoursDialogProps {
  psychologistId: number;
}

const ViewWorkingHoursDialog: React.FC<ViewWorkingHoursDialogProps> = ({
  psychologistId,
}) => {
  const [workingHours, setWorkingHours] = useState<Availability[] | null>(null);
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
          
          // setWorkingHours(data?.[0]?.available?.days ?? []);
          setWorkingHours([data?.[0]?.available].filter(Boolean) as Availability[]);


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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Hours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Psychologist Working Days</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : workingHours && workingHours.length > 0 ? (
            <div className="border rounded-lg p-3">
              <h3 className="font-medium mb-2">Working Days</h3>
              <ul className="space-y-4">
                {workingHours.map((day, index) => (
                  <li key={index}>
                    <p className="font-semibold">{day.dayOfWeek}</p>
                    <hr className="my-1" />
                    {day.slots && day.slots.length > 0 ? (
                      day.slots.map((slot, slotIndex) => (
                        <div key={slot.id ?? slotIndex} className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic">No slots available</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No working days set</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewWorkingHoursDialog;
