// BranchForm.tsx
"use client";

import {useState, useTransition, useEffect} from "react";
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
import {Branch} from "@/type/branch";
import {addBranchAction, updateBranchAction} from "@/api/BranchApi";
import {formatPhoneNumber} from "@/lib/phoneUtils"; // Import the utility

interface BranchFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onBranchAdded?: (branch: Branch) => void;
  onBranchUpdated?: (branch: Branch) => void;
  onClose?: () => void;
  branchToEdit?: Branch | null;
}

export function BranchForm({
                             className,
                             onBranchAdded,
                             onBranchUpdated,
                             onClose,
                             branchToEdit,
                             ...props
                           }: BranchFormProps)
{
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Prefill form if editing
  useEffect(() => {
    if (branchToEdit)
    {
      setBranchName(branchToEdit.name);
      setAddress(branchToEdit.address);
      setTotalFloor(branchToEdit.totalFloor.toString());
      setTotalRooms(branchToEdit.totalRooms.toString());
      setContactNumber(branchToEdit.contactNumber);
      setEmail(branchToEdit.email);
    }
  }, [branchToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation for contact number format
    if (!/^0 \(\d{3}\) \d{3} \d{2} \d{2}$/.test(contactNumber))
    {
      setError("Invalid phone number format (e.g., 0 (123) 456 78 90)");
      return;
    }

    const branchData: Branch = {
      id: branchToEdit?.id,
      name: branchName,
      address,
      totalFloor: parseInt(totalFloor),
      totalRooms: parseInt(totalRooms),
      contactNumber,
      email,
    };

    startTransition(async () => {
      try
      {
        const response = branchToEdit
            ? await updateBranchAction(branchData)
            : await addBranchAction(branchData);
        if (branchToEdit && onBranchUpdated)
        {
          onBranchUpdated(response);
        } else if (onBranchAdded)
        {
          onBranchAdded(response);
        }
        // Reset form
        setBranchName("");
        setAddress("");
        setTotalFloor("");
        setTotalRooms("");
        setContactNumber("");
        setEmail("");
      } catch (err)
      {
        setError(err instanceof Error ? err.message : "Failed to process branch");
      }
    });
  };

  const handleCancel = () => {
    setBranchName("");
    setAddress("");
    setTotalFloor("");
    setTotalRooms("");
    setContactNumber("");
    setEmail("");
    setError(null);
    if (onClose)
    {
      onClose();
    }
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <DialogContent onCloseAutoFocus={handleCancel}>
          <DialogHeader>
            <DialogTitle>{branchToEdit ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 py-4">
              {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                    id="branchName"
                    type="text"
                    placeholder="Enter branch name"
                    required
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalFloor">Total Floors</Label>
                <Input
                    id="totalFloor"
                    type="number"
                    min="1"
                    placeholder="Enter number of floors"
                    required
                    value={totalFloor}
                    onChange={(e) => setTotalFloor(e.target.value)}
                    disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalRooms">Total Rooms</Label>
                <Input
                    id="totalRooms"
                    type="number"
                    min="1"
                    placeholder="Enter number of rooms"
                    required
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="0 (123) 456 78 90"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(formatPhoneNumber(e.target.value))}
                    maxLength={17}
                    disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter branch email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    type="text"
                    placeholder="Enter branch address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (branchToEdit ? "Updating..." : "Adding...") : (branchToEdit ? "Update Branch" : "Add Branch")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </div>
  );
}