import {
    Appointment,
    AppointmentStatus,
  } from "@/type/appointment";
  import { useState } from "react";

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    updateAppointmentStatusAction,
  } from "@/api/AppointmentApi";
  import { toast } from "sonner";


type StatusCellProps = {
    appointment: Appointment;
  };
  
  const StatusCell: React.FC<StatusCellProps> = ({ appointment }) => {
    const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleStatusChange = async (newStatus: AppointmentStatus) => {
      setIsLoading(true);
      const result = await updateAppointmentStatusAction(appointment.id, newStatus);
  
      if (result.success) {
        const updatedAppointment = result.data as Appointment;
        setStatus(updatedAppointment.status);
        appointment.status = updatedAppointment.status;
        toast.success("Success", {
          description: "Status updated successfully",
        });
      } else {
        let errorMessage = "Failed to update status";
        const errorData = result.error as { details?: string; message?: string };
        if (errorData?.details) {
          errorMessage = errorData.details;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
        toast.error("Error", { description: errorMessage });
        setStatus(appointment.status); // Revert to original
      }
  
      setIsLoading(false);
    };
  
    const statusLabels = (status: string) => {
      const labels: Record<string, string> = {
        SCHEDULED : "Planlandı",
        COMPLETED : "Tamamlandı",
        CANCELLED : "İptal Edildi",
        NOT_ATTENDED : "Katılmadı",
        IN_PROGRESS : "Devam Ediyor",
        CONFIRMED : "Onaylandı",
        RESCHEDULED : "Yeniden Planlandı",
        NO_SHOW : "Gelmeyen"
        
      };
    
      return labels[status] ?? status;
    };
  
    

    return (
      <div className="text-right">
        <Select
          value={status}
          onValueChange={(value: AppointmentStatus) => handleStatusChange(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(AppointmentStatus).map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {statusLabels(statusOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };
  export default StatusCell;