"use client";
import React, { useState, useEffect } from "react";
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
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { Appointment, AppointmentStatus } from "@/type/appointment";
import { deleteAppointmentAction } from "@/api/AppointmentApi";
import { EditIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role } from "@/type/role";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  getAllAdminAssignedPatientsByNameAction,
  getPatientByNameAction,
} from "@/api/PatientApi";
import { Patient } from "@/type/patient";

interface AppointmentTableProps<TData, TValue> {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showAddButton?: boolean;
  isAdmin?: boolean;
  isFilter?: boolean;
}

export function AppointmentTable<TData extends Appointment, TValue>({
  title,
  columns,
  data: initialData,
  showAddButton = true,
  isAdmin,
  isFilter = false
}: AppointmentTableProps<TData, TValue>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [data, setData] = useState<TData[]>(initialData);
  const [appointmentToEdit, setAppointmentToEdit] = useState<TData | null>(
    null
  );
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
    null
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async (search: string, isAdmin: boolean) => {
      try {
        const patientData =
          user?.role === Role.ADMIN
            ? await getAllAdminAssignedPatientsByNameAction(search)
            : isAdmin === true
              ? await getAllAdminAssignedPatientsByNameAction(search)
              : await getPatientByNameAction(search);

        setPatients(patientData);
      } catch {
        setPatients([]);
      }
    };
    fetchPatients(search, isAdmin ?? false);
  }, [user?.role, search, isAdmin]);

  const handleAddClick = () => {
    setAppointmentToEdit(null);
    setIsDialogOpen(true);
  };

  const handleAppointmentAdded = (appointment: Appointment) => {
    setData((prev) => [...prev, appointment as TData]);
    setIsDialogOpen(false);
    toast.success("Success", { description: "Randevu başarıyla eklendi" });
  };

  const handleAppointmentUpdated = (updatedAppointment: Appointment) => {
    setData((prev) =>
      prev.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? (updatedAppointment as TData)
          : appointment
      )
    );
    setIsDialogOpen(false);
    toast.success("Success", {
      description: "Randevu başarıyla güncellendi",
    });
  };

  const handleEditAppointment = (appointment: TData) => {
    setAppointmentToEdit(appointment);
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    const appointment = data.find((appt) => appt.id === appointmentId);
    if (appointment?.status === AppointmentStatus.COMPLETED) {
      toast.error("Cannot Delete", {
        description: "Tamamlanan randevular silinemez",
      });
      return;
    }
    setAppointmentToDelete(appointmentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (appointmentToDelete !== null) {
      try {
        await deleteAppointmentAction(appointmentToDelete);
        setData((prev) =>
          prev.filter((appointment) => appointment.id !== appointmentToDelete)
        );
        toast.success("Success", {
          description: "Randevu başarıyla silindi",
        });
      } catch (err) {
        console.error("Failed to delete appointment:", err);
        toast.error("Error", { description: "Randevu silinemedi" });
      } finally {
        setIsDeleteDialogOpen(false);
        setAppointmentToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setAppointmentToEdit(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  // Filter columns based on user role
  const filteredColumns =
    user?.role === Role.ADMIN
      ? columns
      : columns.filter(
        (col) =>
          col.id !== "psychologistPayment" && col.id !== "messageStatus"
      );

  const modifiedColumns: ColumnDef<TData, TValue>[] = filteredColumns.map(
    (col) =>
      col.id === "actions"
        ? {
          ...col,
          cell: ({ row }) => {
            const appointment = row.original;
            return (
              <div className="text-right">
                <div className="flex justify-end space-x-2">
                  <EditIcon
                    size={17}
                    className="cursor-pointer"
                    onClick={() => handleEditAppointment(appointment)}
                  />
                  {user?.role === Role.ADMIN && (
                    <Trash
                      size={17}
                      className="cursor-pointer text-destructive"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    />
                  )}
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
        showAddButton={showAddButton}
        onAddClick={handleAddClick}
        isFilter={isFilter}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AppointmentForm
          onAppointmentAdded={handleAppointmentAdded}
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={handleDialogClose}
          appointmentToEdit={appointmentToEdit}
          patients={patients}
          setSearch={setSearch}
          search={search}
        />
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme İşlemini Onayla</DialogTitle>
            <DialogDescription>
              Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
