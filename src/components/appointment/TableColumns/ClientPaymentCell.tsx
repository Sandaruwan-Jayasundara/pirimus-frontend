import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/type/appointment";
import { ClientPaymentDialog } from "../ClientPaymentDialog";

type Props = {
  appointment: Appointment;
};

const ClientPaymentCell: React.FC<Props> = ({ appointment }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="text-right">
      <Button variant="outline" className="bg-yellow-500/10" onClick={handleOpenDialog}>
        Client Payment Info
      </Button>
      <ClientPaymentDialog
        appointment={appointment}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default ClientPaymentCell;
