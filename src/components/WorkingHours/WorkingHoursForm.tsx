"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  addWorkingHoursAction,
  updateWorkingHoursAction,
} from "@/api/WorkingHoursApi";
import { DayOfWeek } from "@/type/days";

import { WorkingHours } from "@/type/WorkingHours";

export interface WorkingHR extends WorkingHours {
  // Add existing properties here
  days: DayOfWeek[]; // Add the 'days' property as an array of DayOfWeek
}
interface WorkingHoursFormProps {
  initialData?: WorkingHR;
  onWorkingHoursUpdated?: (workingHours: WorkingHours) => void;
  onClose?: () => void;
}


export function WorkingHoursForm({
  initialData,
  onWorkingHoursUpdated,
  onClose,
}: WorkingHoursFormProps) {

  
  const getInitialDays = (): WorkingHR => {
    // Check if initialData exists and has a days array with length > 0
    if (initialData && initialData.days && initialData.days.length > 0) {
      return { ...initialData, days: [...initialData.days] };
    }
    return {
      id: 0,
      psychologist: 0,
      available: {
        dayOfWeek: [],
        slots: [],
      },
      days: [],
      dayOfWeek: "",
      length: 0, 
    };
    
  };

  const [formData, setFormData] = useState<WorkingHR>(getInitialDays());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(getInitialDays());
  }, [initialData]);

  const handleToggle = (day: DayOfWeek) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        let response;
        console.log("Before Submitted working days:", formData);

        if (formData.id) {
          response = await updateWorkingHoursAction(formData);
        } else {
          response = await addWorkingHoursAction(formData);
        }
        console.log("Submitted working days:", response);
        if (onWorkingHoursUpdated) onWorkingHoursUpdated(response as WorkingHours);
        if (onClose) onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save working days"
        );
      }
    });
  };

  const handleCancel = () => {
    setError(null);
    if (onClose) onClose();
  };

  return (
    <DialogContent className="max-h-[80vh] flex flex-col">
      <DialogHeader className="shrink-0">
        <DialogTitle>
          {formData.id ? "Update Working Days" : "Set Working Days"}
        </DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-3">
              {Object.values(DayOfWeek).map((day: DayOfWeek) => (
                <div key={day} className="flex items-center gap-2">
                  <Switch
                    checked={formData.days.includes(day)}
                    onCheckedChange={() => handleToggle(day)}
                    disabled={isPending}
                  />
                  <span className="font-medium">
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
      <DialogFooter className="shrink-0 px-4 py-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} onClick={handleSubmit}>
          {isPending
            ? "Saving..."
            : formData.id
            ? "Update Working Days"
            : "Save Working Days"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default WorkingHoursForm;
