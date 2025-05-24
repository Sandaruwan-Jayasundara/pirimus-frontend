import {columns} from "@/components/patient/PatientColumns"
import {PatientTable} from "@/components/patient/PatientTable";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";
import {getPatientAction} from "@/api/PatientApi";


export default async function Patient() {
  const data = await getPatientAction();

  return (
      <ProtectedRoute allowedRoles={[Role.PSYCHOLOGIST]}>
        <PatientTable title={"Hasta Yönetimi"} columns={columns} data={data}/>
      </ProtectedRoute>
  )
}
