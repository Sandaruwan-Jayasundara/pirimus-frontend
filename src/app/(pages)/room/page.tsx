// Room.tsx
import {columns} from "@/components/room/admin/RoomColumns";
import {RoomTable} from "@/components/room/admin/RoomTable";

import {getBranches} from "@/api/BranchApi";
import {getRoomsData} from "@/api/RoomApi";
import {Role} from "@/type/role";
import ProtectedRoute from "@/context/ProtectedRoute";

export default async function Room() {
  const rooms = await getRoomsData();
  const branches = await getBranches();
  return (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>

      <div className="container mx-auto py-10">
        <RoomTable title="Rooms" columns={columns} data={rooms} branches={branches}/>
      </div>
      </ProtectedRoute>
  );
}