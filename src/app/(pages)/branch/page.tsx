// page.tsx (Server Component)
import {BranchTable} from "@/components/branch/BranchTable";
import {columns} from "@/components/branch/BranchColumns";
import {getBranches} from "@/api/BranchApi";
import ProtectedRoute from "@/context/ProtectedRoute";
import {Role} from "@/type/role"; // Adjust path


export default async function BranchPage() {
  const branches = await getBranches();

  return (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
      <div>
        <BranchTable
            title="Branch Management"
            columns={columns}
            data={branches}
        />
      </div>
      </ProtectedRoute>
  );
}