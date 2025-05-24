"use client";
import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Psychologist } from "@/type/psychologist";
import { deletePsychologistAction } from "@/api/PsychologistApi";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Import sonner toast

interface PsychologistTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function PsychologistTable<TData extends Psychologist, TValue>({
  title,
  columns,
  data: initialData,
}: PsychologistTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [psychologistToDelete, setPsychologistToDelete] = React.useState<
    number | null
  >(null);

  const handleDeletePsychologist = (psychologistId: number) => {
    setPsychologistToDelete(psychologistId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (psychologistToDelete !== null) {
      try {
        const response = await deletePsychologistAction(psychologistToDelete);
        if (response.status === "success") {
          setData((prev) =>
            prev.filter(
              (psychologist) => psychologist.id !== psychologistToDelete
            )
          );
          toast.success("Psychologist Deleted", {
            description: response.message, // Display the message from the backend
          });
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        toast.error("Delete Failed", {
          description:
            err instanceof Error
              ? err.message
              : "Failed to delete psychologist",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setPsychologistToDelete(null);
      }
    }
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setPsychologistToDelete(null);
  };

  // Modify the "actions" column to ensure delete functionality
  const modifiedColumns: ColumnDef<TData, TValue>[] = columns.map((col) =>
    col.id === "actions"
      ? {
        ...col,
        cell: ({ row }) => {
          const psychologist = row.original;
          return (
            <div className="text-right">
              <div className="flex justify-end space-x-2">
                <Trash
                  size={17}
                  className="cursor-pointer text-destructive"
                  onClick={() =>
                    handleDeletePsychologist(psychologist?.id ?? 0)
                  }
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
      <hr className="mt-5" />
      <div className="mt-5 md:mt-8">
        <DataTable title={title} columns={modifiedColumns} data={data} />
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme İşlemini Onayla</DialogTitle>
            <DialogDescription>
              Bu psikoloğu silmek istediğinizden emin misiniz? Bu işlem, psikoloğu silinmiş olarak işaretleyecektir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          <Button variant="outline" onClick={handleDeleteDialogClose}>
  İptal
</Button>
<Button variant="destructive" onClick={confirmDelete}>
  Sil
</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
