"use client";
import React, {useState, useEffect} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Room, Availability} from "@/type/room";
import {Branch} from "@/type/branch";
import RoomAvailabilityForm from "./RoomAvailabilityForm";
import {addRoomAction, updateRoomAction} from "@/api/RoomApi";

interface RoomFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onRoomAdded?: (room: Room) => void;
  onRoomUpdated?: (room: Room) => void;
  onClose?: () => void;
  branches: Branch[];
  roomToEdit?: Room | null;
}

export function RoomForm({
                           className,
                           onRoomAdded,
                           onRoomUpdated,
                           onClose,
                           branches,
                           roomToEdit,
                           ...props
                         }: RoomFormProps)
{
  const [formData, setFormData] = useState<Room>({
    name: "",
    floorNumber: 0,
    hourlyRate: 0,
    cancellationPeriod: 0, // Initialize new field
    availability: [],
    branch: {id: 0, name: "", address: "", totalFloor: 0, totalRooms: 0, contactNumber: "", email: ""},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(Date.now());

  useEffect(() => {
    if (roomToEdit)
    {
      setFormData(roomToEdit);
    }
  }, [roomToEdit]);

  const handleAvailabilitySet = (availability: Availability[]) => {
    setFormData((prev) => ({
      ...prev,
      availability,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try
    {
      const selectedBranch = branches.find((b) => b.id === formData.branch.id) || formData.branch;

      const roomData: Room = {
        ...formData,
        id: roomToEdit?.id || now,
        branch: selectedBranch,
      };

      const response = roomToEdit
          ? await updateRoomAction(roomData)
          : await addRoomAction(roomData);

      if (roomToEdit && onRoomUpdated)
      {
        onRoomUpdated(response);
      } else if (onRoomAdded)
      {
        onRoomAdded(response);
      }

      resetForm();
      if (onClose) onClose();
    } catch (err)
    {
      setError(err instanceof Error ? err.message : "Failed to process room");
    } finally
    {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      floorNumber: 0,
      hourlyRate: 0,
      cancellationPeriod: 0, // Reset new field
      availability: [],
      branch: {id: 0, name: "", address: "", totalFloor: 0, totalRooms: 0, contactNumber: "", email: ""},
    });
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <DialogContent onCloseAutoFocus={handleCancel}>
          <DialogHeader>
            <DialogTitle>{roomToEdit ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 py-4">
              {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="branchId">Branch</Label>
                <Select
                    value={formData.branch.id?.toString() || ""}
                    onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          branch: {...prev.branch, id: parseInt(value)},
                        }))
                    }
                    disabled={isLoading}
                >
                  <SelectTrigger id="branchId">
                    <SelectValue placeholder="Select a branch"/>
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id?.toString() ?? ""}>
                          {branch.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                    id="roomName"
                    type="text"
                    placeholder="Enter room name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))}
                    disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                    id="floor"
                    type="number"
                    min="0"
                    placeholder="Enter floor number"
                    required
                    value={formData.floorNumber.toString()}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          floorNumber: parseInt(e.target.value) || 0,
                        }))
                    }
                    disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter hourly rate"
                    required
                    value={formData.hourlyRate.toString()}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hourlyRate: parseFloat(e.target.value) || 0,
                        }))
                    }
                    disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cancellationPeriod">Cancellation Period (Days)</Label>
                <Input
                    id="cancellationPeriod"
                    type="number"
                    min="0"
                    placeholder="Enter cancellation period in day"
                    required
                    value={formData.cancellationPeriod.toString()}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cancellationPeriod: parseInt(e.target.value) || 0,
                        }))
                    }
                    disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label>Availability</Label>
                <RoomAvailabilityForm
                    onAvailabilitySet={handleAvailabilitySet}
                    initialAvailability={formData.availability}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (roomToEdit ? "Updating..." : "Adding...") : (roomToEdit ? "Update Room" : "Add Room")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </div>
  );
}