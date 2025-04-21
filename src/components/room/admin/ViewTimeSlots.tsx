"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Availability} from "@/type/room";

interface ViewTimeSlotsDialogProps {
  availability?: Availability[];
}

const ViewTimeSlotsDialog: React.FC<ViewTimeSlotsDialogProps> = ({availability = []}) => {
  // Helper function to format HH:mm:ss to HH:mm
  const formatTime = (time: string): string => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`; // Return HH:mm
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            View Slots
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Room Availability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {availability && availability.length > 0 ? (
                availability.map((avail, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h3 className="font-medium">
                        {(avail.dayOfWeek ?? "Unknown").charAt(0) + (avail.dayOfWeek ?? "Unknown").slice(1).toLowerCase()}
                      </h3>
                      <ul className="mt-2 space-y-1">
                        {(avail.slots ?? []).map((slot, slotIndex) => (
                            <li key={slotIndex} className="text-sm">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}:{" "}
                              <span className={slot.isAvailable ? "text-primary" : "text-destructive"}>
                        {slot.isAvailable ? "Available" : "Booked"}
                      </span>
                            </li>
                        ))}
                      </ul>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No availability set</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default ViewTimeSlotsDialog;