// BranchApi.tsx
"use server";
import {Branch} from "@/type/branch";
import {serverApi} from "@/lib/serverApi";
import {ApiResponse} from "@/type/ApiResponse";

// Define the expected response type


export const serverBranchApi = async () => {
  const {get, post, put, del} = await serverApi();

  const addBranch = (data: Branch) => post<Branch>("/api/branches/create", data);
  const getBranches = () => get<Branch[]>("/api/branches");
  const updateBranch = (data: Branch) => put<Branch>(`/api/branches/${data.id}`, data);
  const deleteBranch = (branchId: number) => del<ApiResponse>(`/api/branches/${branchId}`);

  return {
    addBranch,
    getBranches,
    updateBranch,
    deleteBranch,
  };
};

export async function addBranchAction(branchData: Branch)
{
  const {addBranch} = await serverBranchApi();
  const newBranch = await addBranch(branchData);
  return newBranch;
}

export async function updateBranchAction(branchData: Branch)
{
  const {updateBranch} = await serverBranchApi();
  const updatedBranch = await updateBranch(branchData);
  return updatedBranch;
}

export async function deleteBranchAction(branchId: number): Promise<ApiResponse>
{
  const {deleteBranch} = await serverBranchApi();
  return await deleteBranch(branchId);
}

export async function getBranches(): Promise<Branch[]>
{
  const {getBranches} = await serverBranchApi();
  return await getBranches();
}