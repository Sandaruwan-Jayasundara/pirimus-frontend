// File: DailyAppointmentList.tsx
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment } from "@/type/appointment";

type DailyAppointmentListProps = {
  adminAppointments: Appointment[];
  psychologistAppointments: Appointment[];
};

function formatTimeRange(startTime: string, endTime: string): string {
  const start = new Date(startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} - ${end}`;
}

export default function DailyAppointmentList({
  adminAppointments,
  psychologistAppointments,
}: DailyAppointmentListProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Günlük Randevu Listesi</h2>
      <div className="mt-9 md:mt-4 space-y-6">
        <Tabs defaultValue="admin-assigned-appointments" className="space-y-4">
          <TabsList
            className="flex flex-col sm:flex-row gap-2 w-full
             justify-center sm:justify-start"
          >
            <TabsTrigger
              value="admin-assigned-appointments"
              className="w-full sm:w-auto rounded-md transition-colors
               data-[state=active]:bg-green-500
               data-[state=active]:text-white"
            >
              Admin Atanmış Randevular
            </TabsTrigger>

            <TabsTrigger
              value="own-appointments"
              className="w-full sm:w-auto rounded-md transition-colors
               data-[state=active]:bg-green-500
               data-[state=active]:text-white"
            >
              Kendi Randevularım
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="admin-assigned-appointments"
            className="space-y-4 "
          >
            <Table className=" mt-6 md:mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri Adı</TableHead>
                  <TableHead>Zaman</TableHead>
                  <TableHead>Oda Adı</TableHead>
                  <TableHead>Şube Adı</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminAppointments.length > 0 ? (
                  adminAppointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell className="text-foreground text-xs sm:text-sm">{`${appt.patient.firstName} ${appt.patient.lastName}`}</TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm">
                        {formatTimeRange(appt.startTime, appt.endTime)}
                      </TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm">{appt.roomName}</TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm">{appt.branchName}</TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm">{appt.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-xs sm:text-sm">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="own-appointments" className="space-y-4">
            <Table className="text-xs mt-4">
              <TableHeader>
                <TableRow>

                  <TableHead>Müşteri Adı</TableHead>
                  <TableHead>Zaman</TableHead>
                  <TableHead>Oda Adı</TableHead>
                  <TableHead>Şube Adı</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {psychologistAppointments.length > 0 ? (
                  psychologistAppointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell className="text-foreground text-xs sm:text-sm" >{`${appt.patient.firstName} ${appt.patient.lastName}`}</TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm" >
                        {formatTimeRange(appt.startTime, appt.endTime)}
                      </TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm" >{appt.roomName}</TableCell>
                      <TableCell className="text-foreground text-xs sm:text-sm" >{appt.branchName}</TableCell>
                      <TableCell className="text-green-600 text-xs sm:text-sm font-bold px-2 py-1 rounded">{appt.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Veri yok
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
