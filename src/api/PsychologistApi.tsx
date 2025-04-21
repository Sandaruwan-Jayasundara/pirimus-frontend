"use server";
import {Psychologist} from "@/type/psychologist";
import {serverApi} from "@/lib/serverApi";
import {ApiResponse} from "@/type/ApiResponse"; // Import ApiResponse type

export const serverPsychologistApi = async () => {
  const {get, put, del} = await serverApi();

  const getPsychologists = () => get<Psychologist[]>("/api/psychologists");
  
  const searchPsychologists = (search :string) => get<Psychologist[]>(`/api/psychologists/search/${search}`);
  const updatePsychologistStatus = (id: number, status: "ACTIVE" | "INACTIVE") =>
      put<Psychologist>(`/api/psychologists/${id}/status`, {status});
  const deletePsychologist = (psychologistId: number) =>
      del<ApiResponse>(`/api/psychologists/${psychologistId}`); // Update to return ApiResponse
  const getPsychologistCount = () => get<number>("/api/psychologists/count");
  const updatePsychologistBlockTiming = (psychologistId: number, applyBlockTiming: boolean) =>
      put<Psychologist>(`/api/psychologists/${psychologistId}/block-timing?applyBlockTiming=${applyBlockTiming}`);

  return {
    getPsychologists,
    searchPsychologists,
    updatePsychologistStatus,
    deletePsychologist,
    getPsychologistCount,
    updatePsychologistBlockTiming
  };
};

export async function updatePsychologistStatusAction(id: number, status: "ACTIVE" | "INACTIVE")
{
  const {updatePsychologistStatus} = await serverPsychologistApi();
  const updatedPsychologist = await updatePsychologistStatus(id, status);
  return updatedPsychologist;
}

export async function getPsychologist()
{
  const {getPsychologists} = await serverPsychologistApi();
  return await getPsychologists();
}


export async function searchPsychologist(search : string)
{
  const {searchPsychologists} = await serverPsychologistApi();
  return await searchPsychologists(search);
}

export async function deletePsychologistAction(psychologistId: number): Promise<ApiResponse>
{
  const {deletePsychologist} = await serverPsychologistApi();
  return await deletePsychologist(psychologistId); // Return the ApiResponse
}

export async function getPsychologistCountAction()
{
  const {getPsychologistCount} = await serverPsychologistApi();
  const count = await getPsychologistCount();
  return count;
}

export async function updatePsychologistBlockTimingAction(psychologistId: number, applyBlockTiming: boolean): Promise<Psychologist>
{
  const {updatePsychologistBlockTiming} = await serverPsychologistApi();
  return await updatePsychologistBlockTiming(psychologistId, applyBlockTiming);
}