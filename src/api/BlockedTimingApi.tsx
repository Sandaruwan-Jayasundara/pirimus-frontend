"use server";
import {BlockedTiming} from "@/type/BlockedTiming";
import {serverApi} from "@/lib/serverApi";

export const serverBlockedTimingApi = async () => {
  const {get, post, put} = await serverApi();

  const addBlockedTiming = (data: BlockedTiming) => post<BlockedTiming>("/api/blockedTimings/add", data);
  const updateBlockedTiming = (data: BlockedTiming) => put<BlockedTiming>("/api/blockedTimings/update", data);
  const getBlockedTiming = () => get<BlockedTiming[]>("/api/blockedTimings");
  const getBlockedTimingById = (id: number) => get<BlockedTiming[]>(`/api/blockedTimings/getBlockedTiming/${id}`);
  const getDaysLimit = () => get<number>("/api/blockedTimings/daysLimit");
  return {addBlockedTiming, getDaysLimit, updateBlockedTiming, getBlockedTiming, getBlockedTimingById};
};

export async function addBlockedTimingAction(data: BlockedTiming)
{
  const {addBlockedTiming} = await serverBlockedTimingApi();
  const newBlockedTiming = await addBlockedTiming(data);
  return newBlockedTiming;
}

export async function updateBlockedTimingAction(data: BlockedTiming)
{
  const {updateBlockedTiming} = await serverBlockedTimingApi();
  const updatedBlockedTiming = await updateBlockedTiming(data);
  return updatedBlockedTiming;
}

export async function getBlockedTimingAction()
{
  const {getBlockedTiming} = await serverBlockedTimingApi();
  const blockedTimings = await getBlockedTiming();
  return blockedTimings;
}

export async function getBlockedTimingByIdAction(id: number)
{
  const {getBlockedTimingById} = await serverBlockedTimingApi();
  const blockedTimings = await getBlockedTimingById(id);
  return blockedTimings;
}

export async function getDaysLimitAction()
{
  const {getDaysLimit} = await serverBlockedTimingApi();
  const daysLimit = await getDaysLimit();
  return daysLimit;
}