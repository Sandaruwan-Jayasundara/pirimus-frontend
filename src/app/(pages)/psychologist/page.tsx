"use server";
import {columns} from "@/components/psychologist/PsychologistColumns";
import {getPsychologist} from "@/api/PsychologistApi";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";
import {PsychologistTable} from "@/components/psychologist/PsychologistTable";

export default async function Psychologist() {
  const data = await getPsychologist();
  return (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <PsychologistTable title="Psychologist Management" columns={columns} data={data}/>
      </ProtectedRoute>
  );
}