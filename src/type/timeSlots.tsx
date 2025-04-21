export interface TimeSlotDto {
  id?: number;
  startTime: string; // Using string for simplicity, could use Date if preferred
  endTime: string;
  isAvailable: boolean;
}