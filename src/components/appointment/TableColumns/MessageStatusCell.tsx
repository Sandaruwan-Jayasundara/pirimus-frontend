import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageStatusDialog } from "../MessageStatusDialog";
import { getMessageStatus } from "@/api/MessageApi";
import { Appointment } from "@/type/appointment";
import { MessageLog } from "@/type/MessageLog";

type Props = {
  appointment: Appointment;
};

const MessageStatusCell: React.FC<Props> = ({ appointment }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = async () => {
    setIsLoading(true);
    try {
      const logs = await getMessageStatus(appointment.id);
      setMessageLogs(logs);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch message status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-right">
      <Button
        className="bg-green-500/10"
        variant="outline"
        onClick={handleOpenDialog}
        disabled={isLoading}
      >
        {isLoading ? "Yükleniyor..." : "Mesajları Görüntüle"}
      </Button>
      <MessageStatusDialog
        appointment={appointment}
        messageLogs={messageLogs}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default MessageStatusCell;
