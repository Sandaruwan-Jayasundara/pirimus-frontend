// page.tsx (Server Component)
export const dynamic = "force-dynamic";

import { Cards } from "@/components/dashboard/counter-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/context/ProtectedRoute";
import { Role } from "@/type/role";
import { CancelledAppointments } from "@/components/dashboard/cancelled-appointments/CancelledAppointments";
import { UncollectedAppointments } from "@/components/dashboard/uncollected-payments/UncollectedAppointments";
import { DailyAppointments } from "@/components/dashboard/daily-appointment/DailyAppointments";
import {
  getDailyAppointmentCountAction,
  getWeeklyAppointmentCountAction,
  getMonthlyAppointmentCountAction,
  getDailyAppointmentsTotalFeeAction,
  getWeeklyAppointmentsTotalFeeAction,
  getMonthlyAppointmentsTotalFeeAction,
} from "@/api/AppointmentApi";
import { getPsychologist } from "@/api/PsychologistApi";
import { getPsychologistCountAction } from "@/api/PsychologistApi";
import { getActivePatientCountAction } from "@/api/PatientApi";
import { PsychologistAvailableTable } from "@/components/dashboard/psychologist-availability/PsychologistAvailabilityTable";
import { columns } from "@/components/dashboard/psychologist-availability/PsychologistAvailabilityColumns";
import { CheckAvailabilityTable } from "@/components/dashboard/check-availability/CheckAvailabilityTable";

async function fetchDashboardData() {
  try {
    const [
      psychCount,
      patientCount,
      dailyCount,
      weeklyCount,
      monthlyCount,
      dailyFee,
      weeklyFee,
      monthlyFee,
      psychologistData,
    ] = await Promise.all([
      getPsychologistCountAction(),
      getActivePatientCountAction(),
      getDailyAppointmentCountAction(),
      getWeeklyAppointmentCountAction(),
      getMonthlyAppointmentCountAction(),
      getDailyAppointmentsTotalFeeAction(),
      getWeeklyAppointmentsTotalFeeAction(),
      getMonthlyAppointmentsTotalFeeAction(),
      getPsychologist(),
    ]);

    return {
      psychCount,
      patientCount,
      dailyCount,
      weeklyCount,
      monthlyCount,
      dailyFee,
      weeklyFee,
      monthlyFee,
      psychologistData,
    };
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return {
      psychCount: 0,
      patientCount: 0,
      dailyCount: 0,
      weeklyCount: 0,
      monthlyCount: 0,
      dailyFee: 0,
      weeklyFee: 0,
      monthlyFee: 0,
    };
  }
}

export default async function Dashboard() {
  const dashboardData = await fetchDashboardData();

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN]}>
      <div className="flex flex-1 flex-col gap-8 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Cards
            psychCount={dashboardData.psychCount}
            patientCount={dashboardData.patientCount}
            dailyCount={dashboardData.dailyCount}
            weeklyCount={dashboardData.weeklyCount}
            monthlyCount={dashboardData.monthlyCount}
            dailyFee={dashboardData.dailyFee}
            weeklyFee={dashboardData.weeklyFee}
            monthlyFee={dashboardData.monthlyFee}
          />
        </div>

        <div className="mt-5">
            <CheckAvailabilityTable
                    title="Check Availability"
                    psychologistData={dashboardData.psychologistData || []}
    
                  />
            </div>


        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <Tabs defaultValue="daily-appointments" className="space-y-4">
            <hr />
            <TabsList className="bg-background border-border">
              <TabsTrigger
                value="daily-appointments"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary"
              >
                Daily Appointments
              </TabsTrigger>
              <TabsTrigger
                value="cancelled-appointments"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary"
              >
                Cancelled Appointments
              </TabsTrigger>
              <TabsTrigger
                value="uncollected-payment"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary"
              >
                Uncollected Payment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cancelled-appointments" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-4 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Cancelled Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <CancelledAppointments />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="uncollected-payment" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-4 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Uncollected Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <UncollectedAppointments />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="daily-appointments" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-4 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Daily Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DailyAppointments />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
            <div className="mt-5">
            <PsychologistAvailableTable
                    title="Psychologist Availability"
                    columns={columns}
                    data={dashboardData.psychologistData || []}
                  />
            </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
