import BlockedTimingData from "@/components/BlockedTiming/BlockedTimingData";
import {getBlockedTimingAction} from "@/api/BlockedTimingApi";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";

export default async function BlockedTimingPage() {
  const initialBlockedTiming = await getBlockedTimingAction();

  // Find the first BlockedTiming object with non-empty slots
  const relevantBlockedTiming = initialBlockedTiming.find(bt =>
      bt.blockedTiming.some(day => (day.slots ?? []).length > 0)
  ) || initialBlockedTiming[0] || {blockedTiming: []};


  return (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <div className="container mx-auto py-10">
          <div className="space-y-6">
            <BlockedTimingData blockedTiming={relevantBlockedTiming}/>
          </div>
        </div>
      </ProtectedRoute>
  );
}