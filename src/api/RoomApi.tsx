// serverRoomApi.ts
"use server";
import {serverApi} from "@/lib/serverApi";
import {Room} from "@/type/room";
import {ApiResponse} from "@/type/ApiResponse";

export const serverRoomApi = async () => {
  const {get, post, put, del} = await serverApi();

  const addRoom = (data: Room) => post<Room>("/api/rooms/create", data);
  const getRooms = () => get<Room[]>("/api/rooms/getAllRooms");
  const updateRoom = (data: Room) => put<Room>(`/api/rooms/${data.id}`, data);
  const deleteRoom = (roomId: number) => del<ApiResponse>(`/api/rooms/${roomId}`);
  const getAvailableRooms = (date: string, startTime: string, endTime: string, branchId: number) =>
      get<Room[]>(`/api/appointments/available-rooms?date=${date}&startTime=${startTime}&endTime=${endTime}&branchId=${branchId}`);

  return {
    addRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    getAvailableRooms,
  };
};

export async function addRoomAction(roomData: Room)
{
  const {addRoom} = await serverRoomApi();
  return await addRoom(roomData);
}

export async function updateRoomAction(roomData: Room)
{
  const {updateRoom} = await serverRoomApi();
  return await updateRoom(roomData);
}

export async function deleteRoomAction(roomId: number): Promise<ApiResponse>
{
  const {deleteRoom} = await serverRoomApi();
  return await deleteRoom(roomId);
}

export async function getRoomsData(): Promise<Room[]>
{
  const {getRooms} = await serverRoomApi();
  return await getRooms();
}

export async function getAvailableRoomsAction(date: string, startTime: string, endTime: string, branchId: number): Promise<Room[]>
{
  const {getAvailableRooms} = await serverRoomApi();
  return await getAvailableRooms(date, startTime, endTime, branchId);
}