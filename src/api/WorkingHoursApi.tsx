"use server";
import {serverApi} from "@/lib/serverApi";
import {WorkingHours} from "@/type/WorkingHours";

export const serverWorkingHoursApi = async () => {
  const {get, post, put} = await serverApi();

  const addWorkingHours = (data: unknown) => post<unknown>("/api/workingHours/add", data);
  const updateWorkingHours = (data: unknown) => put<unknown>("/api/workingHours/update", data);
  const getWorkingHours = () => get<WorkingHours[]>("/api/workingHours");
  const getWorkingHoursById = (id: number) => get<WorkingHours[]>(`/api/workingHours/getWorkingHours/${id}`);
  return {addWorkingHours, updateWorkingHours, getWorkingHours, getWorkingHoursById};
};

export async function addWorkingHoursAction(data: unknown)
{
  const {addWorkingHours} = await serverWorkingHoursApi();
  const newWorkingHours = await addWorkingHours(data);
  return newWorkingHours;
}

export async function updateWorkingHoursAction(data: unknown)
{
  const {updateWorkingHours} = await serverWorkingHoursApi();
  const updatedWorkingHours = await updateWorkingHours(data);
  return updatedWorkingHours;
}

export async function getWorkingHoursAction()
{
  const {getWorkingHours} = await serverWorkingHoursApi();
  const workingHours = await getWorkingHours();
  return workingHours;
}

export async function getWorkingHoursByIdAction(id: number)
{
  const {getWorkingHoursById} = await serverWorkingHoursApi();
  const workingHours = await getWorkingHoursById(id);
  return workingHours;
}