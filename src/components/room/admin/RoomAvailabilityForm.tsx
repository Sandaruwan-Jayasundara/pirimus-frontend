"use client";
import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Switch} from "@/components/ui/switch";
import {Plus, Trash2} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Availability} from "@/type/room";
import {DayOfWeek} from "@/type/days";
import {TimeSlotDto} from "@/type/timeSlots";

interface RoomAvailabilityFormData {
  availability: Record<string, { isActive: boolean; slots: TimeSlotDto[] }>;
}

interface RoomAvailabilityFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onAvailabilitySet?: (availability: Availability[]) => void;
  initialAvailability?: Availability[];
}

// Helper function to convert HH:mm:ss to HH:mm format
const formatTime = (time: string): string => {
  if (!time) return "09:00";
  // Assuming time is in HH:mm:ss format from backend
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`; // Return HH:mm
};

export function RoomAvailabilityForm({
                                   
                                       onAvailabilitySet,
                                       initialAvailability,
                                  
                                     }: RoomAvailabilityFormProps)
{
  const getInitialAvailability = (): RoomAvailabilityFormData => {
    const defaultAvailability: RoomAvailabilityFormData = {
      availability: {
        [DayOfWeek.MONDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
        [DayOfWeek.TUESDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
        [DayOfWeek.WEDNESDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
        [DayOfWeek.THURSDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
        [DayOfWeek.FRIDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
        [DayOfWeek.SATURDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
        [DayOfWeek.SUNDAY]: {isActive: false, slots: [{startTime: "09:00", endTime: "17:00", isAvailable: true}]},
      },
    };

    if (!initialAvailability || initialAvailability.length === 0)
    {
      return defaultAvailability;
    }

    const updatedAvailability = {...defaultAvailability.availability};
    initialAvailability.forEach((avail) => {
      if (avail.dayOfWeek && avail.slots)
      {
        updatedAvailability[avail.dayOfWeek] = {
          isActive: true,
          slots: avail.slots.map((slot) => ({
            id: slot.id,
            startTime: formatTime(slot.startTime), // Convert HH:mm:ss to HH:mm
            endTime: formatTime(slot.endTime),     // Convert HH:mm:ss to HH:mm
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true,
          })),
        };
      }
    });

    return {availability: updatedAvailability};
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<RoomAvailabilityFormData>(getInitialAvailability());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(getInitialAvailability());
  }, [initialAvailability]);

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          isActive: !prev.availability[day].isActive,
        },
      },
    }));
  };

  const handleTimeSlotChange = (
      day: string,
      index: number,
      field: "startTime" | "endTime",
      value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          slots: prev.availability[day].slots.map((slot, i) =>
              i === index ? {...slot, [field]: value} : slot
          ),
        },
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          slots: [
            ...prev.availability[day].slots,
            {startTime: "09:00", endTime: "17:00", isAvailable: true},
          ],
        },
      },
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          slots: prev.availability[day].slots.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    setError(null);

    try
    {
      const transformedData: Availability[] = Object.entries(formData.availability)
          .filter(([{}, dayData]) => dayData.isActive)
          .map(([day, dayData]) => ({
            dayOfWeek: day,
            slots: dayData.slots.map((slot) => ({
              ...slot,
              startTime: `${slot.startTime}:00`, // Convert back to HH:mm:ss for backend
              endTime: `${slot.endTime}:00`,     // Convert back to HH:mm:ss for backend
            })),
          }));

  
      if (onAvailabilitySet)
      {
        onAvailabilitySet(transformedData);
      }
      setOpen(false);
    } catch
    {
      setError("Failed to save availability. Please try again.");
    } finally
    {
      setIsLoading(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Set Time Slots</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Room Availability</DialogTitle>
            <DialogDescription>Set the availability schedule for the room.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto scrollbar-hide">
              {Object.entries(formData.availability).map(([day, dayData]) => (
                  <div key={day} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Switch
                            checked={dayData.isActive}
                            onCheckedChange={() => handleDayToggle(day)}
                        />
                        <span className="font-medium">
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </span>
                      </div>
                      {dayData.isActive && (
                          <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTimeSlot(day)}
                          >
                            <Plus className="h-4 w-4 mr-1"/>
                            Add
                          </Button>
                      )}
                    </div>
                    {dayData.isActive &&
                        dayData.slots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <Select
                                  value={slot.startTime}
                                  onValueChange={(value) =>
                                      handleTimeSlotChange(day, index, "startTime", value)
                                  }
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Start"/>
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({length: 24}, (_, i) => {
                                    const time = `${String(i).padStart(2, "0")}:00`;
                                    return (
                                        <SelectItem key={i} value={time}>
                                          {time}
                                        </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <span className="text-sm text-muted-foreground">to</span>
                              <Select
                                  value={slot.endTime}
                                  onValueChange={(value) =>
                                      handleTimeSlotChange(day, index, "endTime", value)
                                  }
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="End"/>
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({length: 24}, (_, i) => {
                                    const time = `${String(i).padStart(2, "0")}:00`;
                                    return (
                                        <SelectItem key={i} value={time}>
                                          {time}
                                        </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              {dayData.slots.length > 1 && (
                                  <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeTimeSlot(day, index)}
                                  >
                                    <Trash2 className="h-4 w-4"/>
                                  </Button>
                              )}
                            </div>
                        ))}
                  </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Availability"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}

export default RoomAvailabilityForm;