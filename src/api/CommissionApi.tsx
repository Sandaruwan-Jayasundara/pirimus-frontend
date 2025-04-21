// CommissionApi.tsx
"use server";
import {CommissionDto} from "@/type/commission";
import {serverApi} from "@/lib/serverApi";

type CommissionTotalResponse = number;

export const serverCommissionApi = async () => {
  const {get, post, put} = await serverApi();

  const addCommission = (data: CommissionDto) => post<CommissionDto>("/api/commissions/create", data);
  const getPendingCommissions = () => get<CommissionDto[]>("/api/commissions/pending");
  const getPaidCommissions = () => get<CommissionDto[]>("/api/commissions/paid");
  const getDailyCommission = (date: string) => get<CommissionTotalResponse>(`/api/commissions/daily?date=${date}`);
  const getWeeklyCommission = (date: string) => get<CommissionTotalResponse>(`/api/commissions/weekly?date=${date}`);
  const getMonthlyCommission = (date: string) => get<CommissionTotalResponse>(`/api/commissions/monthly?date=${date}`);
  const getCommissionByPsychologistId = (psychologistId: number) =>
      get<CommissionTotalResponse>(`/api/commissions/psychologist/${psychologistId}`);

  // New method to update commission status
  const updateCommissionStatus = (commissionId: number, status: "PENDING" | "PAID") =>
      put<CommissionDto>(`/api/commissions/${commissionId}/status?status=${status}`);
  return {
    addCommission,
    getPendingCommissions,
    getPaidCommissions,
    getDailyCommission,
    getWeeklyCommission,
    getMonthlyCommission,
    getCommissionByPsychologistId,
    updateCommissionStatus,
  };
};

// Existing actions...
export async function addCommissionAction(commissionData: CommissionDto)
{
  const {addCommission} = await serverCommissionApi();
  const newCommission = await addCommission(commissionData);
  return newCommission;
}

export async function getPendingCommissionsAction(): Promise<CommissionDto[]>
{
  const {getPendingCommissions} = await serverCommissionApi();
  return await getPendingCommissions();
}



export async function getPaidCommissionsAction(): Promise<CommissionDto[]>
{
  const {getPaidCommissions} = await serverCommissionApi();
  return await getPaidCommissions();
}



export async function getDailyCommissionAction(date: string): Promise<number>
{
  const {getDailyCommission} = await serverCommissionApi();
  return await getDailyCommission(date);
}

export async function getWeeklyCommissionAction(date: string): Promise<number>
{
  const {getWeeklyCommission} = await serverCommissionApi();
  return await getWeeklyCommission(date);
}

export async function getMonthlyCommissionAction(date: string): Promise<number>
{
  const {getMonthlyCommission} = await serverCommissionApi();
  return await getMonthlyCommission(date);
}

export async function getCommissionByPsychologistIdAction(psychologistId: number): Promise<number>
{
  const {getCommissionByPsychologistId} = await serverCommissionApi();
  return await getCommissionByPsychologistId(psychologistId);
}

// New action to update commission status
export async function updateCommissionStatusAction(commissionId: number, status: "PENDING" | "PAID"): Promise<CommissionDto>
{
  const {updateCommissionStatus} = await serverCommissionApi();
  return await updateCommissionStatus(commissionId, status);
}