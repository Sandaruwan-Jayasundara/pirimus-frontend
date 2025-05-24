"use client";
import React from "react";
import { AppointmentTable } from "@/components/appointment/AppointmentTable";
import { columns } from "@/components/appointment/AppointmentColumns";
import { Appointment } from "@/type/appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppointmentTableTabsProps {
  adminAppointments: Appointment[];
  nonAdminAppointments: Appointment[];
}

export function AppointmentTableTabs({
  adminAppointments,
  nonAdminAppointments,
}: AppointmentTableTabsProps) {
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="flex flex-col sm:grid sm:grid-cols-2 w-full gap-2 justify-center sm:justify-start mb-8">
          <TabsTrigger
            value="admin"
            className="w-full sm:w-auto rounded-md transition-colors 
               data-[state=active]:bg-green-500 
               data-[state=active]:text-white 
               hover:bg-secondary"
          >
            Yönetici Randevuları
          </TabsTrigger>

          <TabsTrigger
            value="psychologist"
            className="w-full sm:w-auto rounded-md transition-colors 
               data-[state=active]:bg-green-500 
               data-[state=active]:text-white 
               hover:bg-secondary"
          >
            Psikolog Randevuları
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin">
          <AppointmentTable
            title="Yönetici Randevuları"
            columns={columns}
            data={adminAppointments}
            showAddButton={true}
            isAdmin={true}
            isFilter={true}
          />
        </TabsContent>
        <TabsContent value="psychologist">
          <AppointmentTable
            title="Psikolog Randevuları"
            columns={columns}
            data={nonAdminAppointments}
            showAddButton={true}
            isAdmin={false}
            isFilter={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
