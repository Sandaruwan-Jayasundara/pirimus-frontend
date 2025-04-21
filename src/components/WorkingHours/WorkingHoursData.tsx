"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { WorkingHours } from "@/type/WorkingHours";
import WorkingHoursWithTime from "./WorkingHoursWithTime";


export default function WorkingHoursData({ workingHours }: { workingHours: WorkingHours }) {
 
  const initialData: WorkingHours = {
    id: workingHours?.id ?? 0,
    psychologist: workingHours?.psychologist ?? 0,
    available: Array.isArray(workingHours?.available) ? workingHours.available : [],
  };
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<WorkingHours>(initialData);

  const handleWorkingHoursUpdated = (updatedWorkingHours: WorkingHours) => {
    // Ensure updated data has days property
    const safeUpdatedData: WorkingHours = {
      ...updatedWorkingHours,
      days: updatedWorkingHours.available?.dayOfWeek ?? [],
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
            {(data?.days?.length ?? 0) > 0 ? "Edit Working Days" : "Set Working Days"}
          </Button>
        </CardHeader>

        <CardContent className="p-4">
        {(data?.days ?? []).length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* {(data.days ?? []).map((day, index) => (

      <div key={index} className="border rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold">{day}</h2>
        <div>
          {day?.slots.length > 0 ? (
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
      </div>


    ))} */}


    {(data.available?.dayOfWeek ?? []).map((day, index) => (
  <div key={index} className="border rounded-lg shadow-md p-4">
    <h2 className="text-xl font-semibold">{day}</h2>
    <div>
      {(data.available?.slots?.[index]?.startTime && data.available?.slots?.[index]?.endTime) ? (
        <div className="flex items-center">
          <span className="font-medium">
            {`${data.available.slots[index].startTime} - ${data.available.slots[index].endTime}`}
          </span>
        </div>
      ) : (
        <p>No slots available</p>
      )}
    </div>
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
        {/* <WorkingHoursForm
              initialData={data}
              onWorkingHoursUpdated={handleWorkingHoursUpdated}
              onClose={handleDialogClose}
          />

 */}

        <WorkingHoursWithTime
          initialAvailability={data}
          onAvailabilitySet={handleWorkingHoursUpdated}
        />


      </Dialog>
    </>
  );
}
