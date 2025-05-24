// PaymentHistoryTable.tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/ColumnHeader";
import { DataTable } from "@/components/ui/DataTable";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Payment } from "@/type/payment";
import { getPaymentRecordHistoryAction } from "@/api/PaymentApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommissionTable } from "@/components/commission/CommissionTable";
import {
  getPaidCommissionsAction,
  getPendingCommissionsAction,
} from "@/api/CommissionApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CommissionDto } from "@/type/commission";
import { tr } from 'date-fns/locale';

export const paymentHistoryColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ödeme Tarihi" />
    ),
    cell: ({ row }) => {
      const paymentDate = row.original.paymentDate;
      return paymentDate ? format(new Date(paymentDate), "PPP") : "N/A";
    },
  },
  {
    accessorKey: "appointmentTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Randevu Saati" />
    ),
    cell: ({ row }) => {
      const appointmentTime = row.original.appointmentStartTime;
      return appointmentTime
        ? format(new Date(appointmentTime), "HH:mm")
        : "N/A";
    },
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hasta Adı" />
    ),
    cell: ({ row }) => row.original.patientName || "N/A",
  },
  {
    accessorKey: "psychologistName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Psikolog Adı" />
    ),
    cell: ({ row }) => row.original.psychologistName || "N/A",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tutar" />
    ),
    cell: ({ row }) => `₺${row.original.amount?.toFixed(2) || "0.00"}`,
  },
  {
    accessorKey: "paymentType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ödeme Türü" />
    ),
    cell: ({ row }) => row.original.paymentType || "N/A",
  },
];

export function PaymentHistoryTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refresh, setRefresh] = useState(false);
  const [pendingCommission, setPendingCommission] = useState<CommissionDto[]>(
    []
  );
  const [paidCommission, setPaidCommission] = useState<CommissionDto[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const pendingCommissions = await getPendingCommissionsAction();
      const paidCommissions = await getPaidCommissionsAction();
      setPendingCommission(pendingCommissions);
      setPaidCommission(paidCommissions);
    };
    fetchPayments();
  }, [refresh]);

  useEffect(() => {
    const fetchPayments = async (selectedDate: Date) => {
      try {
        const data = await getPaymentRecordHistoryAction(
          selectedDate
        );

        setPayments(data as Payment[]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch payment history"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPayments(selectedDate);
  }, [selectedDate]);

  const refreshTable = () => {
    setRefresh(!refresh);
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  
  return (
    <>
      <div className="p-6 mt-5">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger onClick={() => refreshTable()} value="pending">
              Bekleyen Liste
            </TabsTrigger>
            <TabsTrigger onClick={() => refreshTable()} value="paid">
              Ödenmiş
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <CommissionTable
              title={"Bekleyen Oda Komisyonları"}
              data={pendingCommission}
              tab="pending"
            />
          </TabsContent>
          <TabsContent value="paid">
            <CommissionTable
              title={"Ödenen Oda Komisyonları"}
              data={paidCommission}
              tab="paid"
            />
          </TabsContent>
        </Tabs>
      </div>
      <hr />
      <div className="p-6 ">
        <div className="d-flex justify-content-end align-items-end mt-5 mb-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] text-left">
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                locale={tr}
                mode="single"
                selected={selectedDate}
                onSelect={(day) => day && setSelectedDate(day)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <DataTable
          title={"Psikolog Ödemeleri"}
          columns={
            paymentHistoryColumns as ColumnDef<{
              startTime?: string;
              status?: string;
            }>[]
          }
          data={payments as { startTime?: string; status?: string }[]}
          showAddButton={false}
        />
      </div>
    </>
  );
}
