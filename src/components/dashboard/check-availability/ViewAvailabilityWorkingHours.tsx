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

interface ViewAvailabilityWorkingHoursDialogProps {
  psychologistId: number;
}

type Slot = {
  startTime?: string;
  endTime?: string;
  id?: string | number;
};

type Availability = {
  dayOfWeek: string;
  slots: Slot[];
};

const daysOfWeekOrdered = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const ViewAvailabilityWorkingHoursDialog: React.FC<
  ViewAvailabilityWorkingHoursDialogProps
> = ({ psychologistId }) => {
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
  
          const available = data?.[0]?.available;
  
          if (available?.dayOfWeek && Array.isArray(available.dayOfWeek)) {
            const formatted: Availability[] = available.dayOfWeek.map((day) => ({
              dayOfWeek: day,
              slots: available.slots ?? [],
            }));
  
            setWorkingHours(formatted);
          } else {
            setWorkingHours([]);
          }
        } catch (err) {
          setError("Psikolog çalışma saatlerini eklemedi. Lütfen daha sonra tekrar deneyin.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchWorkingHours();
    }
  }, [isOpen, psychologistId, workingHours]);
  

  const getSlotsForDay = (day: string): Slot[] => {
    return (
      workingHours?.find((d) => d.dayOfWeek === day)?.slots ?? []
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
        Saatleri Görüntüle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
        <DialogTitle>Psikolog Müsaitliği</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : workingHours && workingHours.length > 0 ? (
            <div className="grid grid-cols-7 gap-4 text-sm border rounded-lg p-4 bg-gray-50">
              {daysOfWeekOrdered.map((day) => (
                <div key={day} className="flex flex-col items-start">
                  <div className="font-medium text-center w-full border-b pb-1 mb-1">
                    {day}
                  </div>
                  {getSlotsForDay(day).length > 0 ? (
                    getSlotsForDay(day).map((slot, index) => (
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
