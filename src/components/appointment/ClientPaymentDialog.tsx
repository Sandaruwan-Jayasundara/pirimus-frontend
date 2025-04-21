"use client";
import { useEffect, useState } from "react";
import { Appointment, PaymentStatus } from "@/type/appointment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePatientPaymentDetailsAction } from "@/api/PatientPaymentApi";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/type/role";

interface ClientPaymentDialogProps {
  appointment: Appointment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientPaymentDialog({
  appointment,
  isOpen,
  onOpenChange,
}: ClientPaymentDialogProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>(
    appointment.patientPayment?.paymentStatus || appointment.paymentStatus
  );
  const [paidAmount, setPaidAmount] = useState<number | undefined>(
    appointment.patientPayment?.paidAmount || appointment.paidAmount
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [paymentProportion, setPaymentProportion] = useState("");

    const { user } = useAuth();
  const isAdmin = user?.role === Role.ADMIN;

  useEffect(() => {
    if (
      (paidAmount ?? 0) < (appointment?.patientPayment?.remainingAmount ?? 0) &&
      (paidAmount ?? 0) > 0
    ) {
      setPaymentProportion("HALF");
    } else if (paidAmount === appointment?.patientPayment?.remainingAmount) {
      setPaymentProportion("FULL");
    } else {
      setPaymentProportion("");
    }
  }, [appointment?.patientPayment?.totalFee, paidAmount]);

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    setPaymentStatus(newStatus);
    setHasChanges(
      newStatus !== appointment.patientPayment?.paymentStatus ||
        paidAmount !== appointment.patientPayment?.paidAmount
    );
  };

  const handlePaidAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setPaidAmount(numericValue);
    setHasChanges(numericValue !== appointment.patientPayment?.paidAmount || paymentStatus !== appointment.patientPayment?.paymentStatus);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedAppointment = await updatePatientPaymentDetailsAction(
        appointment.id,
        paidAmount || 0,
        paymentStatus || PaymentStatus.PENDING
      );
      if (updatedAppointment) {
        window.location.reload();
      }

      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update client payment details:", error);
      setPaymentStatus(
        appointment.patientPayment?.paymentStatus || appointment.paymentStatus
      );
      setPaidAmount(
        appointment.patientPayment?.paidAmount || appointment.paidAmount
      );
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setPaymentStatus(
      appointment.patientPayment?.paymentStatus || appointment.paymentStatus
    );
    setPaidAmount(
      appointment.patientPayment?.paidAmount || appointment.paidAmount
    );
    setHasChanges(false);
    onOpenChange(false);
  };
  // Ensure totalFee and remainingAmount are numbers with a default of 0 if undefined
  const totalFee = appointment.patientPayment?.totalFee ?? 0;

  const remainingAmount = appointment.patientPayment?.remainingAmount ?? 0;

  const getFilteredStatuses = (
    paymentProportion: string | null | undefined
  ) => {
    if (paymentProportion === "HALF") return [PaymentStatus.PARTIALLY_PAID];
    if (paymentProportion === "FULL") return [PaymentStatus.COMPLETED];
    if (paymentProportion === "")
      return [
        PaymentStatus.PENDING,
        PaymentStatus.PARTIALLY_PAID,
        PaymentStatus.COMPLETED,
      ];
    return Object.values(PaymentStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Client Payment Information</DialogTitle>
        </DialogHeader>

        {(appointment.patient.isAssignByAdmin  && appointment.assignedByAdmin ) || (!appointment.patient.isAssignByAdmin && !appointment.assignedByAdmin) || (isAdmin && appointment.patient.isAssignByAdmin  && !appointment.assignedByAdmin )? (
          remainingAmount !== 0 ? (
            <>
              <div className="space-y-4">
                <div>
                  <strong>Total Amount:</strong> ${totalFee.toFixed(2)}
                </div>
                <div>
                  <strong>Remaining Amount:</strong> $
                  {remainingAmount.toFixed(2)}
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div>
                  <Label htmlFor="clientPaidAmount">Paid Amount</Label>
                  <Input
                    id="clientPaidAmount"
                    type="number"
                    value={
                      paidAmount === undefined || paidAmount === 0
                        ? ""
                        : paidAmount
                    }
                    onChange={(e) => handlePaidAmountChange(e.target.value)}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                    placeholder="Enter paid amount"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPaymentStatus">Payment Status</Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={handlePaymentStatusChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="clientPaymentStatus" className="w-full">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredStatuses(paymentProportion).map(
                        (statusOption) => (
                          <SelectItem key={statusOption} value={statusOption}>
                            {statusOption}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 text-right space-x-2">
                {hasChanges ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleCancel}>
                    Close
                  </Button>
                )}
              </div>
            </>
          ) : 
          (
            <>
              <div
                className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                {(appointment.patient.isAssignByAdmin  && appointment.assignedByAdmin && !isAdmin)?
                  " Payment is managed by Admin"
                  :
                  `Payment Completed $${totalFee.toFixed(2)}`}
              </div>
            </>
          )
        ) : (
          <>
            <div
              className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              Payment is managed by Admin
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
