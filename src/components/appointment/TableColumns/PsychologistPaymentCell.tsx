import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updatePsychologistPaymentDetailsAction } from "@/api/AppointmentApi";
import { Appointment, PaymentStatus, PaymentType } from "@/type/appointment";
// import { updatePsychologistPaymentDetailsAction } from "@/actions"; // adjust this too

type Props = {
  appointment: Appointment;
};

const PsychologistPaymentCell: React.FC<Props> = ({ appointment }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>(
    appointment.paymentStatus
  );
  const [paidAmount, setPaidAmount] = useState<number | undefined>(
    appointment.paidAmount
  );
  const [paymentType, setPaymentType] = useState<PaymentType | undefined>(
    PaymentType.CASH
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const [paymentProportion, setPaymentProportion] = useState("");

  const handleOpenDialog = () => {
    setPaymentStatus(appointment.paymentStatus);
    setPaidAmount(appointment.paidAmount);
    setPaymentType(appointment.paymentType);
    setHasChanges(false);
    setIsDialogOpen(true);
  };

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    if (
      paidAmount === appointment.totalFee &&
      newStatus === PaymentStatus.PENDING
    ) {
      setError("Cannot select PENDING if full payment amount is entered.");
      return;
    }
    setError("");
    setPaymentStatus(newStatus);
    setHasChanges(
      newStatus !== appointment.paymentStatus ||
        paidAmount !== appointment.paidAmount ||
        paymentType !== appointment.paymentType
    );
  };

  const handlePaidAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    if (appointment?.totalFee && numericValue < appointment.totalFee) {
      setError("Paid amount cannot be less than total fee");
      setPaymentProportion("");
    } else {
      setError("");
      setPaymentProportion("FULL");
    }
    setPaidAmount(numericValue);
    setHasChanges(
      numericValue !== appointment.paidAmount ||
        paymentStatus !== appointment.paymentStatus ||
        paymentType !== appointment.paymentType
    );
  };

  const handlePaymentTypeChange = (newPaymentType: PaymentType) => {
    setPaymentType(newPaymentType);
    setHasChanges(
      newPaymentType !== appointment.paymentType ||
        paidAmount !== appointment.paidAmount ||
        paymentStatus !== appointment.paymentStatus
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedAppointment = await updatePsychologistPaymentDetailsAction(
        appointment.id,
        paidAmount,
        paymentStatus,
        paymentType || PaymentType.CASH
      );
      if (updatedAppointment) {
        window.location.reload();
      }
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update payment details:", error);
      setPaymentStatus(appointment.paymentStatus);
      setPaidAmount(appointment.paidAmount);
      setPaymentType(appointment.paymentType);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setPaymentStatus(appointment.paymentStatus);
    setPaidAmount(appointment.paidAmount);
    setPaymentType(appointment.paymentType);
    setHasChanges(false);
    setIsDialogOpen(false);
  };

  const getFilteredStatuses = (
    paymentProportion: string | null | undefined
  ) => {
    if (paymentProportion === "FULL") return [PaymentStatus.COMPLETED];
    if (paymentProportion === "")
      return [PaymentStatus.PENDING, PaymentStatus.COMPLETED];
    return Object.values(PaymentStatus);
  };

  return (
    <div className="text-right">
      <Button variant="outline" onClick={handleOpenDialog}>
        Payment Information
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Psychologist Payment Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-t border-gray-200 my-4"></div>
            {appointment.patient.fee === appointment.paidAmount ? (
              <div
                className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                Payment Completed ${appointment?.paidAmount?.toFixed(2)}
              </div>
            ) : (
              // )

              // : appointment?.paymentStatus === PaymentStatus.NO_FEE ? (
              //   <div
              //     className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              //     role="alert"
              //   >
              //     No Fee Applied
              //   </div>

              <>
                <div>
                  <strong>Total Amount:</strong> $
                  {appointment.patient.fee?.toFixed(2)}
                </div>
                <div>
                  <Label htmlFor="paidAmount">Paid Amount</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    value={paidAmount === 0 ? "" : paidAmount}
                    onChange={(e) => handlePaidAmountChange(e.target.value)}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                    placeholder="Enter paid amount"
                    className="w-full"
                  />
                </div>
                {error && (
                  <span
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg dark:bg-gray-800"
                    role="alert"
                  >
                    {error}
                  </span>
                )}
                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={handlePaymentStatusChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="paymentStatus" className="w-full">
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
                <div>
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <Select
                    value={paymentType}
                    onValueChange={handlePaymentTypeChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="paymentType" className="w-full">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PaymentType).map((typeOption) => (
                        <SelectItem key={typeOption} value={typeOption}>
                          {typeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 text-right space-x-2">
            {hasChanges && paymentStatus === PaymentStatus.COMPLETED ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={
                    isLoading || paidAmount !== appointment?.patient?.fee
                  }
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleCancel}>
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PsychologistPaymentCell;
