// MessageStatusDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MessageLog} from "@/type/MessageLog";
import {Appointment} from "@/type/appointment";

interface MessageStatusDialogProps {
  appointment: Appointment;
  messageLogs: MessageLog[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MessageStatusDialog({
                                      appointment,
                                      messageLogs,
                                      isOpen,
                                      onOpenChange,
                                    }: MessageStatusDialogProps)
{
  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Message Status for Appointment #{appointment.id}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <h3 className="font-semibold">Client Messages</h3>
              {messageLogs
                  .filter((log) => log.recipient === appointment.patient?.phone)
                  .map((log) => (
                      <div key={log.id} className="border-t py-2">
                        <p><strong>Type:</strong> {log.messageType}</p>
                        <p><strong>Status:</strong> {log.status}</p>
                        <p><strong>Sent At:</strong> {new Date(log.sentAt).toLocaleString()}</p>
                        {log.failureReason && (
                            <p><strong>Failure Reason:</strong> {log.failureReason}</p>
                        )}
                      </div>
                  ))}
              {messageLogs.filter((log) => log.recipient === appointment.patient?.phone).length === 0 && (
                  <p>No messages sent to client.</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Psychologist Messages</h3>
              {messageLogs
                  .filter((log) => log.recipient === appointment.psychologist?.phoneNumber)
                  .map((log) => (
                      <div key={log.id} className="border-t py-2">
                        <p><strong>Type:</strong> {log.messageType}</p>
                        <p><strong>Status:</strong> {log.status}</p>
                        <p><strong>Sent At:</strong> {new Date(log.sentAt).toLocaleString()}</p>
                        {log.failureReason && (
                            <p><strong>Failure Reason:</strong> {log.failureReason}</p>
                        )}
                      </div>
                  ))}
              {messageLogs.filter((log) => log.recipient === appointment.psychologist?.phoneNumber).length === 0 && (
                  <p>No messages sent to psychologist.</p>
              )}
            </div>
          </div>
          <div className="mt-4 text-right">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}