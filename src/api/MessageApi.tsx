"use server";
import {MessageLog} from "@/type/MessageLog";
import {serverApi} from "@/lib/serverApi";

export const serverMessageApi = async () => {
  const {get} = await serverApi();

  const getMessages = (page: number = 0, size: number = 10) =>
      get<MessageLog[]>(`/api/messages?page=${page}&size=${size}`);
  const getMessageStatus = (appointmentId: number) =>
      get<MessageLog[]>(`/api/messages/appointment/${appointmentId}`);

  return {
    getMessages,
    getMessageStatus,
  };
};

export async function getMessages(page: number = 0, size: number = 10): Promise<MessageLog[]>
{
  const {getMessages} = await serverMessageApi();
  return await getMessages(page, size);
}

export async function getMessageStatus(appointmentId: number): Promise<MessageLog[]>
{
  const {getMessageStatus} = await serverMessageApi();
  return await getMessageStatus(appointmentId);
}