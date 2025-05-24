// Cards.tsx (Client Component)
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Stethoscope, Users, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getRoomIncomeCountAction, getPsychologistCountAction } from "@/api/PaymentApi";
import { tr } from 'date-fns/locale';

type CardsProps = {
  psychCount: number;
  patientCount: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  dailyFee: number;
  weeklyFee: number;
  monthlyFee: number;
};

export function Cards({
  psychCount,
  patientCount,
  dailyCount,
  weeklyCount,
  monthlyCount,
}: CardsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date()
  );
  const [psychologistDate, setPsychologistDate] = useState<Date>(
    new Date()
  );
  const [roomIncomeCount, setRoomIncomeCount] = useState<unknown>(null);
  const [psycologistIncomeCount, setPsycologistIncome] = useState<number | null>(0);


  useEffect(() => {
    const fetchRoomIncomeCount = async () => {
      try {
        const adjustedDate = new Date(selectedDate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        const result = await getRoomIncomeCountAction(adjustedDate);
        setRoomIncomeCount(result);
      } catch (error) {
        console.error("Error fetching room income count:", error);
      }
    };

    fetchRoomIncomeCount();
  }, [selectedDate]);


  useEffect(() => {
    const fetchPsycologistIncomeCount = async () => {
      try {
        const adjustedDate = new Date(psychologistDate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        const result = await getPsychologistCountAction(adjustedDate);
        setPsycologistIncome(result as number);
      } catch (error) {
        console.error("Error fetching room income count:", error);
      }
    };

    fetchPsycologistIncomeCount();
  }, [psychologistDate]);



  const appointmentCount = {
    daily: dailyCount,
    weekly: weeklyCount,
    monthly: monthlyCount,
  }[selectedPeriod];


  const countColor = {
    daily: "text-primary",
    weekly: "text-accent-foreground",
    monthly: "text-muted-foreground",
  }[selectedPeriod];

  return (
    <>
      {/* Total Psychologists Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow bg-primary/10 duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Toplam Psikolog
          </CardTitle>
          <Stethoscope className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {psychCount?.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Active Clients Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-blue-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Aktif Danışanlar
          </CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {patientCount?.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Appointments Card with Dropdown */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-yellow-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Randevular
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px] border-input text-foreground focus:ring-ring bg-yellow-100">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Günlük</SelectItem>
                <SelectItem value="weekly">Haftalık</SelectItem>
                <SelectItem value="monthly">Aylık</SelectItem>
              </SelectContent>
            </Select>
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${countColor}`}>
            {appointmentCount?.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Room Income Status Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-red-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Oda Gelir Durumu
          </CardTitle>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] text-left bg-red-200">
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  locale={tr}
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date ?? new Date())}
                // disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${countColor}`}>
            ₺
            {typeof roomIncomeCount === "number"
              ? roomIncomeCount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
              : "N/A"}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 	bg-purple-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Psikolog Geliri
          </CardTitle>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] text-left 	bg-purple-200">
                  {psychologistDate ? format(psychologistDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  locale={tr}
                  mode="single"
                  selected={psychologistDate}
                  onSelect={(date) => setPsychologistDate(date ?? new Date())}
                // disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${countColor}`}>
            ₺
            {psycologistIncomeCount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
