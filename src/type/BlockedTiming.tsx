import {Availability} from "@/type/room";

export type BlockedTiming = {
  id?: number;
  daysLimit: number;
  blockedTiming: Availability[];
}