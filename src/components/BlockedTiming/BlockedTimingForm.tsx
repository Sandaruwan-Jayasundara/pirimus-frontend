"use client";
import React, {useState, useEffect, useTransition} from "react";
import {Button} from "@/components/ui/button";
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
import {Input} from "@/components/ui/input";
import {DayOfWeek} from "@/type/days";
import {Availability} from "@/type/room";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {addBlockedTimingAction, updateBlockedTimingAction} from "@/api/BlockedTimingApi";
import {BlockedTiming} from "@/type/BlockedTiming";

interface BlockedTimingFormProps {
  initialData?: BlockedTiming;
  onBlockedTimingUpdated?: (blockedTiming: BlockedTiming) => void;
  onClose?: () => void;
}

export function BlockedTimingForm({initialData, onBlockedTimingUpdated, onClose}: BlockedTimingFormProps)
{
  const getInitialBlockedTiming = (): BlockedTiming => {
    const defaultBlockedTiming: Availability[] = Object.values(DayOfWeek).map(day => ({
      dayOfWeek: day,
      slots: [],
    }));

    if (!initialData || !initialData.blockedTiming || initialData.blockedTiming.length === 0)
    {
      return {daysLimit: 7, blockedTiming: defaultBlockedTiming}; // Default daysLimit to 7
    }

    return {
      ...initialData,
      daysLimit: initialData.daysLimit || 7, // Preserve existing or default to 7
      blockedTiming: defaultBlockedTiming.map(defaultDay => {
        const matchingDay = initialData.blockedTiming.find(day => day.dayOfWeek === defaultDay.dayOfWeek);
        if (matchingDay && (matchingDay.slots ?? []).length > 0)
        {
          return {
            ...matchingDay,
            slots: (matchingDay.slots ?? []).map(slot => ({
              ...slot,
              startTime: slot.startTime.split("T")[1]?.slice(0, 5) || "09:00",
              endTime: slot.endTime.split("T")[1]?.slice(0, 5) || "17:00",
            })),
          };
        }
        return defaultDay;
      }),
    };
  };

  const [formData, setFormData] = useState<BlockedTiming>(getInitialBlockedTiming());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(getInitialBlockedTiming());
  }, [initialData]);

  const handleDaysLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData(prev => ({
      ...prev,
      daysLimit: isNaN(value) || value < 0 ? 0 : value,
    }));
  };

  const handleToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      blockedTiming: prev.blockedTiming.map(d =>
          d.dayOfWeek === day
              ? {
                ...d,
                slots: (d.slots ?? []).length > 0 ? [] : [{startTime: "09:00", endTime: "17:00", isAvailable: false}],
              }
              : d
      ),
    }));
  };

  const handleTimeSlotChange = (
      day: string,
      index: number,
      field: "startTime" | "endTime",
      value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      blockedTiming: prev.blockedTiming.map(d =>
          d.dayOfWeek === day
              ? {
                ...d,
                slots: (d.slots ?? []).map((slot, i) => (i === index ? {...slot, [field]: value} : slot)),
              }
              : d
      ),
    }));
  };

  const addTimeSlot = (day: string) => {
    setFormData(prev => ({
      ...prev,
      blockedTiming: prev.blockedTiming.map(d =>
          d.dayOfWeek === day
              ? {...d, slots: [...(d.slots || []), {startTime: "09:00", endTime: "17:00", isAvailable: false}]}
              : d
      ),
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      blockedTiming: prev.blockedTiming.map(d =>
          d.dayOfWeek === day ? {...d, slots: (d.slots ?? []).filter((_, i) => i !== index)} : d
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try
      {
        // Filter out days with no slots and prepare data for backend
        const filteredBlockedTiming = formData.blockedTiming.filter(day => (day.slots ?? []).length > 0);
        const submitData: BlockedTiming = {
          daysLimit: formData.daysLimit, // Include daysLimit explicitly
          blockedTiming: filteredBlockedTiming.map(day => ({
            dayOfWeek: day.dayOfWeek,
            slots: (day.slots ?? []).map(slot => ({
              startTime: slot.startTime, // Sending as HH:mm format
              endTime: slot.endTime,
              isAvailable: slot.isAvailable,
            })),
          })),
        };

        let response;
        if (formData.id)
        {
          submitData.id = formData.id;
          response = await updateBlockedTimingAction(submitData);
        } else
        {
          response = await addBlockedTimingAction(submitData);
        }
        if (onBlockedTimingUpdated) onBlockedTimingUpdated(response);
        if (onClose) onClose();
      } catch (err)
      {
        setError(err instanceof Error ? err.message : "Failed to save blocked timing");
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
          <DialogTitle>{formData.id ? "Update Blocked Timing" : "Set Blocked Timing"}</DialogTitle>
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="daysLimit" className="font-medium">
                    Advance Booking Limit (days)
                  </label>
                  <Input
                      id="daysLimit"
                      type="number"
                      min="0"
                      value={formData.daysLimit}
                      onChange={handleDaysLimitChange}
                      disabled={isPending}
                      className="w-[200px]"
                      placeholder="Enter days limit"
                  />
                </div>
                {formData.blockedTiming.map(dayData => (
                    <div key={dayData.dayOfWeek} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Switch
                              checked={(dayData.slots ?? []).length > 0}
                              onCheckedChange={() => handleToggle(dayData.dayOfWeek ?? "")}
                              disabled={isPending}
                          />
                          <span className="font-medium">
                        {(dayData.dayOfWeek ?? "").charAt(0) + (dayData.dayOfWeek ?? "").slice(1).toLowerCase()}
                      </span>
                        </div>
                        {(dayData.slots?.length ?? 0) > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addTimeSlot(dayData.dayOfWeek ?? "")}
                                disabled={isPending}
                            >
                              <Plus className="h-4 w-4 mr-1"/>
                              Add
                            </Button>
                        )}
                      </div>
                      {(dayData.slots ?? []).length > 0 &&
                          (dayData.slots ?? []).map((slot, index) => (
                              <div key={index} className="flex items-center gap-2 mb-2">
                                <Select
                                    value={slot.startTime}
                                    onValueChange={value =>
                     
                                        handleTimeSlotChange(dayData.dayOfWeek ?? "", index, "startTime", value)
                                    }
                                    disabled={isPending}
                                >
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Start"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 24}, (_, i) => (
                                        <SelectItem
                                            key={i}
                                            value={`${String(i).padStart(2, "0")}:00`}
                                        >
                                          {`${String(i).padStart(2, "0")}:00`}
                                        </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">to</span>
                                <Select
                                    value={slot.endTime}
                                    onValueChange={value =>
                                        handleTimeSlotChange(dayData.dayOfWeek ?? "", index, "endTime", value)
                                    }
                                    disabled={isPending}
                                >
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="End"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 24}, (_, i) => (
                                        <SelectItem
                                            key={i}
                                            value={`${String(i).padStart(2, "0")}:00`}
                                        >
                                          {`${String(i).padStart(2, "0")}:00`}
                                        </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {(dayData.slots ?? []).length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => removeTimeSlot(dayData.dayOfWeek?? "", index)}
                                        disabled={isPending}
                                    >
                                      <Trash2 className="h-4 w-4"/>
                                    </Button>
                                )}
                              </div>
                          ))}
                    </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        <DialogFooter className="shrink-0 px-4 py-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} onClick={handleSubmit}>
            {isPending ? "Saving..." : (formData.id ? "Update Blocked Timing" : "Save Blocked Timing")}
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}

export default BlockedTimingForm;