// RoomTable.tsx
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
import { RoomForm } from "@/components/room/admin/RoomForm";
import { Branch } from "@/type/branch";
import { Room } from "@/type/room";
import { deleteRoomAction } from "@/api/RoomApi";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import { toast } from "sonner"; // Import Sonner toast

interface RoomTableWrapperProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  branches: Branch[];
}

export function RoomTable<TData extends Room, TValue>({
  title,
  columns,
  data: initialData,
  branches,
}: RoomTableWrapperProps<TData, TValue>) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<TData[]>(initialData);
  const [roomToEdit, setRoomToEdit] = React.useState<TData | null>(null);
  const [roomToDelete, setRoomToDelete] = React.useState<number | null>(null);

  const handleAddClick = () => {
    setRoomToEdit(null);
    setIsDialogOpen(true);
  };

  const handleRoomAdded = (room: Room) => {
    setData((prev) => [...prev, room as TData]);
    setIsDialogOpen(false);
    toast.success("Room Added", {
      description: "New room has been successfully added.",
    });
  };

  const handleRoomUpdated = (updatedRoom: Room) => {
    setData((prev) =>
      prev.map((room) =>
        room.id === updatedRoom.id ? (updatedRoom as TData) : room
      )
    );
    setIsDialogOpen(false);
    toast.success("Room Updated", {
      description: "Room has been successfully updated.",
    });
  };

  const handleEditRoom = (room: TData) => {
    setRoomToEdit(room);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = (roomId: number) => {
    setRoomToDelete(roomId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (roomToDelete !== null) {
      try {
        const response = await deleteRoomAction(roomToDelete); // Get the ApiResponse
        if (response.status === "success") {
          setData((prev) => prev.filter((room) => room.id !== roomToDelete));
          toast.success("Room Deleted", {
            description: response.message, // Use the message from the response
          });
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        toast.error("Delete Failed", {
          description: err instanceof Error ? err.message : "Failed to delete room",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setRoomToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRoomToEdit(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  const modifiedColumns: ColumnDef<TData, TValue>[] = columns.map((col) =>
    col.id === "actions"
      ? {
        ...col,
        cell: ({ row }) => {
          const room = row.original;
          return (
            <div className="text-right">
              <div className="flex justify-end space-x-2">
                <EditIcon
                  size={17}
                  className="cursor-pointer"
                  onClick={() => handleEditRoom(room)}
                />
                <Trash
                  size={17}
                  className="cursor-pointer text-destructive"
                  onClick={() => handleDeleteRoom(room?.id ?? 0)}
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
        columns={modifiedColumns as ColumnDef<{ startTime?: string; status?: string }, TValue>[]}
        data={data as { startTime?: string; status?: string }[]}
        showAddButton={true}
        onAddClick={handleAddClick}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <RoomForm
          onRoomAdded={handleRoomAdded}
          onRoomUpdated={handleRoomUpdated}
          onClose={handleDialogClose}
          branches={branches}
          roomToEdit={roomToEdit}
        />
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme İşlemini Onayla</DialogTitle>
            <DialogDescription>
              Bu odayı silmek istediğinizden emin misiniz? Bu işlem, odayı silinmiş olarak işaretleyecektir.
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