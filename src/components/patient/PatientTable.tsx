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
import {PatientForm} from "@/components/patient/PatientForm";
import {Patient} from "@/type/patient";
import {EditIcon, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {deletePatientAction} from "@/api/PatientApi";
import {useAuth} from "@/context/AuthContext";
import {Role} from "@/type/role";
import {toast} from "sonner";

interface PatientTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function PatientTable<TData extends Patient, TValue>({
                                                              title,
                                                              columns,
                                                              data: initialData,
                                                            }: PatientTableProps<TData, TValue>)
{
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<TData[]>(initialData);
  const [patientToEdit, setPatientToEdit] = React.useState<TData | null>(null);
  const [patientToDelete, setPatientToDelete] = React.useState<number | null>(null);
  const {user} = useAuth();
  const isAdmin = user?.role === Role.ADMIN;

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handlePatientAdded = (patient: Patient) => {
    setData((prev) => [...prev, patient as TData]);
    setIsAddDialogOpen(false);
    toast.success("Patient Added", {
      description: "New patient has been successfully added.",
    });
  };

  const handlePatientUpdated = (updatedPatient: Patient) => {
    setData((prev) =>
        prev.map((patient) =>
            patient.id === updatedPatient.id ? (updatedPatient as TData) : patient
        )
    );
    setIsEditDialogOpen(false);
    toast.success("Patient Updated", {
      description: "Patient has been successfully updated.",
    });
  };

  const handleEditPatient = (patient: TData) => {
    setPatientToEdit(patient);
    setIsEditDialogOpen(true);
  };

  const handleDeletePatient = (patientId: number) => {
    if (!isAdmin)
    {
      toast.error("Permission Denied", {
        description: "Only admins can delete patients.",
      });
      return;
    }
    setPatientToDelete(patientId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (patientToDelete !== null)
    {
      try
      {
        const response = await deletePatientAction(patientToDelete);
        if (response.status === "success")
        {
          setData((prev) => prev.filter((patient) => patient.id !== patientToDelete));
          toast.success("Patient Deleted", {
            description: response.message,
          });
        } else
        {
          throw new Error(response.message);
        }
      } catch (err)
      {
        toast.error("Delete Failed", {
          description: err instanceof Error ? err.message : "Failed to delete patient",
        });
      } finally
      {
        setIsDeleteDialogOpen(false);
        setPatientToDelete(null);
      }
    }
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setPatientToEdit(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const filteredColumns = user?.role === Role.PSYCHOLOGIST
      ? columns
      : columns.filter(col => col.id !== "clientNotes");

  const modifiedColumns: ColumnDef<TData, TValue>[] = filteredColumns.map((col) =>
      col.id === "actions"
          ? {
            ...col,
            cell: ({row}) => {
              const patient = row.original;
              return (
                  <div className="text-right">
                    <div className="flex justify-end space-x-2">
                      <EditIcon
                          size={17}
                          className="cursor-pointer"
                          onClick={() => handleEditPatient(patient)}
                      />
                      {isAdmin && (
                          <Trash
                              size={17}
                              className="cursor-pointer text-destructive"
                              onClick={() => handleDeletePatient(patient?.id ?? 0)}
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
            showAddButton={true}
            onAddClick={handleAddClick}
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <PatientForm onPatientAdded={handlePatientAdded} onClose={handleAddDialogClose}/>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <PatientForm
              onPatientUpdated={handlePatientUpdated}
              onClose={handleEditDialogClose}
              patientToEdit={patientToEdit}
          />
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this patient? This action will mark the patient as deleted and cannot be
                undone.
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