// BranchTable.tsx
"use client";
import React from "react";
import {DataTable} from "@/components/ui/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {BranchForm} from "@/components/branch/BranchForm";
import {Branch} from "@/type/branch";
import {deleteBranchAction} from "@/api/BranchApi";
import {EditIcon, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

interface BranchTableWrapperProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function BranchTable<TData extends Branch & { startTime?: string; status?: string }, TValue>({
                                                            title,
                                                            columns,
                                                            data: initialData,
                                                          }: BranchTableWrapperProps<TData, TValue>)
{
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<TData[]>(initialData);
  const [branchToEdit, setBranchToEdit] = React.useState<TData | null>(null);
  const [branchToDelete, setBranchToDelete] = React.useState<number | null>(null);

  const handleAddClick = () => {
    setBranchToEdit(null);
    setIsDialogOpen(true);
  };

  const handleBranchAdded = (branch: Branch) => {
    setData((prev) => [...prev, branch as TData]);
    setIsDialogOpen(false);
    toast.success("Branch Added", {
      description: "New branch has been successfully added.",
    });
  };

  const handleBranchUpdated = (updatedBranch: Branch) => {
    setData((prev) =>
        prev.map((branch) =>
            branch.id === updatedBranch.id ? (updatedBranch as TData) : branch
        )
    );
    setIsDialogOpen(false);
    toast.success("Branch Updated", {
      description: "Branch has been successfully updated.",
    });
  };

  const handleEditBranch = (branch: TData) => {
    setBranchToEdit(branch);
    setIsDialogOpen(true);
  };

  const handleDeleteBranch = (branchId: number) => {
    setBranchToDelete(branchId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (branchToDelete !== null)
    {
      try
      {
        const response = await deleteBranchAction(branchToDelete);
        if (response.status === "success")
        {
          setData((prev) => prev.filter((branch) => branch.id !== branchToDelete));
          toast.success("Branch Deleted", {
            description: response.message,
          });
        } else
        {
          throw new Error(response.message);
        }
      } catch (err)
      {
        toast.error("Delete Failed", {
          description: err instanceof Error ? err.message : "Failed to delete branch",
        });
      } finally
      {
        setIsDeleteDialogOpen(false);
        setBranchToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setBranchToEdit(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setBranchToDelete(null);
  };

  const modifiedColumns: ColumnDef<TData, TValue>[] = columns.map((col) =>
      col.id === "actions"
          ? {
            ...col,
            cell: ({row}) => {
              const branch = row.original;
              return (
                  <div className="text-right">
                    <div className="flex justify-end space-x-2">
                      <EditIcon
                          size={17}
                          className="cursor-pointer"
                          onClick={() => handleEditBranch(branch)}
                      />
                      <Trash
                          size={17}
                          className="cursor-pointer text-destructive"
                          onClick={() => handleDeleteBranch(branch?.id ?? 0)}
                      />
                    </div>
                  </div>
              );
            },
          }
          : col
  );

  return (
      <>
        <DataTable
            title={title}
            columns={modifiedColumns}
            data={data}
            showAddButton={true}
            onAddClick={handleAddClick}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <BranchForm
              onBranchAdded={handleBranchAdded}
              onBranchUpdated={handleBranchUpdated}
              onClose={handleDialogClose}
              branchToEdit={branchToEdit}
          />
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this branch? This action will mark the branch as deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleDeleteDialogClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
  );
}