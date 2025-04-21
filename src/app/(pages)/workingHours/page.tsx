import WorkingHoursData from "@/components/WorkingHours/WorkingHoursData";
import { getWorkingHoursAction } from "@/api/WorkingHoursApi";
import { Role } from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";
import { WorkingHours } from "@/type/WorkingHours";

export default async function WorkingHoursPage() {
  const initialWorkingHours = await getWorkingHoursAction();
  const initial: WorkingHours = initialWorkingHours?.[0] ?? {
    id: 0,
    psychologist: 0,
    available: [],
  };

  return (
    <ProtectedRoute allowedRoles={[Role.PSYCHOLOGIST]}>
      <div className="container mx-auto py-10">
        <div className="space-y-6">
          <WorkingHoursData workingHours={initial} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
