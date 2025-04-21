import {Branch} from "@/type/branch";
import {TimeSlotDto} from "@/type/timeSlots"; // Assuming this will be created

export type Room = {
  id?: number;
  name: string;
  cancellationPeriod: number; // New field for cancellation period in hours
  floorNumber: number;
  hourlyRate: number; // Using number instead of BigDecimal for simplicity in TS
  availability: Availability[];
  branch: Branch;
}

export interface Availability {
  id?: number;
  dayOfWeek?: string; // You could use an enum for DayOfWeek if needed
  slots?: TimeSlotDto[];
  
}

