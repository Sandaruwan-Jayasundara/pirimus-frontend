export type MessageLog = {
  id?: number;
  appointmentId: number;
  recipient: string;
  messageType: "SMS" | "WHATSAPP";
  messageContent: string;
  status: "SENT" | "FAILED";
  sentAt: string;
  failureReason?: string;
};