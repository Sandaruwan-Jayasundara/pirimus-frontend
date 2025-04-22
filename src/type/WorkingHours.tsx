// import {DayOfWeek} from "@/type/days";

// export interface WorkingHours {
//   id?: number;
//   psychologist?: number;
//   days: DayOfWeek[]; // Using DayOfWeek enum type
// }


export interface WorkingHours {
  dayOfWeek?: string;
  length?: number;
  id?: number;
  psychologist?: number;
  days?: unknown;
  available?: {
    slots?: {
      startTime?: string;
      endTime?: string;
    }[];
    dayOfWeek?: string[];
  };
  slots?: { id?: string; startTime: string; endTime: string }[]; 
}




export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface DayOfWeek {
  dayOfWeek: string;
  slots: Slot[];
}
