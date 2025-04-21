"use client";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Dialog} from "@radix-ui/react-dialog";
import {Button} from "@/components/ui/button";
import BlockedTimingForm from "@/components/BlockedTiming/BlockedTimingForm";
import React from "react";
import {BlockedTiming} from "@/type/BlockedTiming";

export default function BlockedTimingData({blockedTiming}: { blockedTiming: BlockedTiming }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<BlockedTiming>(blockedTiming);

  const handleDialogClose = () => setIsDialogOpen(false);

  const handleBlockedTimingUpdated = (updatedBlockedTiming: BlockedTiming) => {
    setData(updatedBlockedTiming);
    setIsDialogOpen(false);
  };

  // Check if the entire BlockedTiming object is "empty"
  const isEmpty = () => {
    // Check if daysLimit is undefined, null, or 0
    const hasNoDaysLimit = data.daysLimit === undefined || data.daysLimit === null || data.daysLimit === 0;

    // Check if blockedTiming is empty or has no slots
    const hasNoBlockedTiming =
        !data.blockedTiming || // blockedTiming is undefined or null
        data.blockedTiming.length === 0 || // blockedTiming is an empty array
        data.blockedTiming.every(day => (day.slots ?? []).length === 0); // No slots in any day

    // The object is "empty" if it has no daysLimit AND no meaningful blockedTiming
    return hasNoDaysLimit && hasNoBlockedTiming;
  };

  // For display purposes, still check if there are slots to show timing details
  const hasSlots = data.blockedTiming.some(day => (day.slots ?? []).length > 0);

  return (
      <>
        <Card className="w-full border rounded-lg shadow-md">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Blocked Timing</h2>
            <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
              {isEmpty() ? "Set Blocked Timing" : "Edit Blocked Timing"}
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            {/* Display Advance Booking Limit */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold">
                Advance Booking Limit:{" "}
                {data.daysLimit !== undefined && data.daysLimit !== null && data.daysLimit > 0
                    ? `${data.daysLimit} days`
                    : "Not set"}
              </h3>
            </div>

            {/* Display Blocked Timing */}
            {hasSlots ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.blockedTiming.map(dayData => {
                    if ((dayData.slots ?? []).length > 0)
                    {
                      return (
                          <div key={dayData.dayOfWeek} className="border rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-4">
                              {(dayData.dayOfWeek ?? "").charAt(0) + (dayData.dayOfWeek ?? "").slice(1).toLowerCase()}
                            </h2>
                            <div className="grid grid-cols-3 gap-4 text-sm font-medium border-b pb-2 mb-2">
                              <span>Day</span>
                              <span>Time Slots</span>
                              <span>Status</span>
                            </div>
                            {(dayData.slots ?? []).map((slot, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 text-sm py-2">
                          <span>
                            {(dayData.dayOfWeek ?? "").charAt(0) + (dayData.dayOfWeek ?? "").slice(1).toLowerCase()}
                          </span>
                                  <span>{`${slot.startTime} – ${slot.endTime}`}</span>
                                  <span className={slot.isAvailable ? "text-primary" : "text-destructive"}>
                            {slot.isAvailable ? "Available" : "Blocked"}
                          </span>
                                </div>
                            ))}
                          </div>
                      );
                    }
                    return null;
                  })}
                </div>
            ) : (
                <p className="text-center text-muted-foreground">
                  No blocked timing available. `Click Set Blocked Timing` to add them.
                </p>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <BlockedTimingForm
              initialData={data}
              onBlockedTimingUpdated={handleBlockedTimingUpdated}
              onClose={handleDialogClose}
          />
        </Dialog>
      </>
  );
}