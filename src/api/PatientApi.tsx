"use server";
import {Patient} from "@/type/patient";
import {serverApi} from "@/lib/serverApi";
import {ApiResponse} from "@/type/ApiResponse"; // Ensure this is defined

export const serverPatientApi = async () => {
  const {get, post, put, del} = await serverApi();

  const addPatient = (data: Patient) => post<Patient>("/api/patients/register", data);
  const getPatients = () => get<Patient[]>("/api/patients");
  const getSearchPatient = (search:string) => get<Patient[]>(`/api/patients/patient-search/${search}`);
  const updatePatient = (data: Patient) => put<Patient>("/api/patients/updatePatient", data);
  const updatePatientStatus = (patientId: number, newStatus: string) =>
      put<Patient>(`/api/patients/${patientId}/status?newStatus=${newStatus}`);
  const deletePatient = (patientId: number) => del<ApiResponse>(`/api/patients/${patientId}`);
  const activePatientsCount = () => get<number>("/api/patients/active/count");
  const getAdminAssignedEarnings = (psychologistId: number) =>
      get<number>(`/api/patients/fees/admin-assigned/${psychologistId}`);
  const getNonAdminAssignedEarnings = (psychologistId: number) =>
      get<number>(`/api/patients/fees/non-admin-assigned/${psychologistId}`);
  // New API calls
  const getAllAdminAssignedPatients = () => get<Patient[]>("/api/patients/admin-assigned");
  const getSearchAllAdminAssignedPatients = (search:string) => get<Patient[]>(`/api/patients/search-admin-assigned/${search}`);
  const getOtherPatients = () => get<Patient[]>("/api/patients/non-admin-assigned");

  return {
    addPatient,
    getPatients,
    getSearchPatient,
    updatePatient,
    updatePatientStatus,
    deletePatient,
    activePatientsCount,
    getAdminAssignedEarnings,
    getNonAdminAssignedEarnings,
    getAllAdminAssignedPatients,
    getSearchAllAdminAssignedPatients,
    getOtherPatients,
  };
};

export async function addPatientAction(patientData: Patient)
{
  const {addPatient} = await serverPatientApi();
  return await addPatient(patientData);
}

export async function updatePatientAction(patientData: Patient)
{
  const {updatePatient} = await serverPatientApi();
  return await updatePatient(patientData);
}

export async function getPatientAction()
{
  const {getPatients} = await serverPatientApi();
  return await getPatients();
}

export async function getPatientByNameAction(search: string)
{
  const {getSearchPatient} = await serverPatientApi();
  return await getSearchPatient(search);
}

export async function updatePatientStatusAction(patientId: number, newStatus: string)
{
  const {updatePatientStatus} = await serverPatientApi();
  return await updatePatientStatus(patientId, newStatus);
}

export async function deletePatientAction(patientId: number): Promise<ApiResponse>
{
  const {deletePatient} = await serverPatientApi();
  return await deletePatient(patientId);
}

export async function getActivePatientCountAction()
{
  const {activePatientsCount} = await serverPatientApi();
  const count = await activePatientsCount();
  return count;
}

export async function getAdminAssignedEarningsAction(psychologistId: number)
{
  const {getAdminAssignedEarnings} = await serverPatientApi();
  return await getAdminAssignedEarnings(psychologistId);
}

export async function getNonAdminAssignedEarningsAction(psychologistId: number)
{
  const {getNonAdminAssignedEarnings} = await serverPatientApi();
  return await getNonAdminAssignedEarnings(psychologistId);
}

// New action functions
export async function getAllAdminAssignedPatientsAction()
{
  const {getAllAdminAssignedPatients} = await serverPatientApi();
  return await getAllAdminAssignedPatients();
}

// New action functions
export async function getAllAdminAssignedPatientsByNameAction(search: string)
{
  const {getSearchAllAdminAssignedPatients} = await serverPatientApi();
  return await getSearchAllAdminAssignedPatients(search);
}


export async function getOtherPatientsAction()
{
  const {getOtherPatients} = await serverPatientApi();
  return await getOtherPatients();
}