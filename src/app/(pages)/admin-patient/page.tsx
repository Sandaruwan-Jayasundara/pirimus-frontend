import {columns} from "@/components/patient/PatientColumns";
import {PatientTable} from "@/components/patient/PatientTable";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";
import {getAllAdminAssignedPatientsAction, getOtherPatientsAction} from "@/api/PatientApi";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default async function AdminPatient() {
  // Fetch data for both tabs
  const adminAssignedPatients = await getAllAdminAssignedPatientsAction();
  const otherPatients = await getOtherPatientsAction();

  return (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <div className="container mx-auto py-10">
          <Tabs defaultValue="admin-assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin-assigned"
                           className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary"
              >Yönetici Atanan Hastalar</TabsTrigger>
              <TabsTrigger value="other"
                           className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary"
              >Diğer Hastalar</TabsTrigger>
            </TabsList>
            <TabsContent value="admin-assigned">
              <PatientTable
                  title="Yönetici Atanan Hastalar"
                  columns={columns}
                  data={adminAssignedPatients}
              />
            </TabsContent>
            <TabsContent value="other">
              <PatientTable
                  title="Diğer Hastalar"
                  columns={columns}
                  data={otherPatients}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedRoute>
  );
}