export interface Appointment {
  id: number;
  client: string;
  time: string;
  assignedBy: "Admin" | "Psychologist";
}

export interface Session {
  id: number;
  client: string;
  date: string;
  duration: string;
}

export const mockAppointments: Appointment[] = [
  {id: 1, client: "John Doe", time: "10:00 AM", assignedBy: "Admin"},
  {id: 2, client: "Jane Smith", time: "2:00 PM", assignedBy: "Psychologist"},
];

export const mockSessions: Session[] = [
  {id: 1, client: "Alice Brown", date: "Mar 2, 2025", duration: "1h"},
  {id: 2, client: "Bob Johnson", date: "Mar 1, 2025", duration: "45m"},
];