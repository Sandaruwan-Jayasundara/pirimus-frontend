"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { subDays, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { Patient } from "@/type/patient";
import { WorkingHours } from "@/type/WorkingHours";
import { Branch } from "@/type/branch";
import { Room } from "@/type/room";
import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from "@/type/appointment";
import { getAllSlotsAction, getBusySlotsAction } from "@/api/AppointmentApi";
import { getBranches } from "@/api/BranchApi";
import { CalendarIcon } from "lucide-react";
import { getAvailableRoomsAction } from "@/api/RoomApi";
import {
  addAppointmentAction,
  updateAppointmentAction,
} from "@/api/AppointmentApi";
import { Input } from "@/components/ui/input";
import { DayOfWeek } from "@/type/days";
import { getWorkingHoursByIdAction } from "@/api/WorkingHoursApi";
import {
  getBlockedTimingAction,
  getDaysLimitAction,
} from "@/api/BlockedTimingApi";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/type/role";
import { Psychologist } from "@/type/psychologist";
import { tr } from 'date-fns/locale';

interface AppointmentFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onAppointmentAdded?: (appointment: Appointment) => void;
  onAppointmentUpdated?: (appointment: Appointment) => void;
  onClose?: () => void;
  appointmentToEdit?: Appointment | null;
  patients: Patient[];
  setSearch: (query: string) => void;
  search: string;
}
interface TimeSlot {
  start: number;
  end: number;
}

interface TimeRange {
  start: number;
  end: number;
}

export function AppointmentForm({
  className,
  onAppointmentAdded,
  onAppointmentUpdated,
  onClose,
  appointmentToEdit,
  patients,
  setSearch,
  search,
  ...props
}: AppointmentFormProps) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [patientId, setPatientId] = useState<number | "">("");
  const [roomName, setRoomName] = useState("");
  const [branchId, setBranchId] = useState<number | "">("");
  const [totalFee, setTotalFee] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [paidAmount, setPaidAmount] = useState<number | "">("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [daysLimit, setDaysLimit] = useState<number>(7);
  const [patientRecord, setPatientRecord] = useState<Patient[]>([]);
  const isAdmin = user?.role === Role.ADMIN;

  // Only update search if length is 2 or more
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    setTotalFee(patients[0]?.fee);
  }, [patients]);

  useEffect(() => {
    setPatientRecord(patients);
  }, [patients]);

  // Fetch initial data (excluding patients, which are now passed as props)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchData, daysLimitData] = await Promise.all([
          getBranches(),
          getDaysLimitAction(),
        ]);
        setBranches(branchData);
        setDaysLimit(daysLimitData);
      } catch (err) {
        setError("Failed to load data from API: " + err);
      }
    };
    fetchData();
  }, []);

  // Prefill form if editing an existing appointment
  useEffect(() => {
    if (appointmentToEdit) {
      const startDate = new Date(appointmentToEdit.startTime);
      setDate(startDate);
      const startTimeStr = format(startDate, "HH");
      const endTimeStr = format(new Date(appointmentToEdit.endTime), "HH");

      setTime(`${startTimeStr} - ${endTimeStr}`);
      setPatientId(appointmentToEdit.patient.id);
      setSearch(appointmentToEdit.patient.firstName);
      setRoomName(appointmentToEdit.roomName);
      setBranchId(appointmentToEdit.branchId);
      setTotalFee(appointmentToEdit.totalFee ?? 0);
      setPaymentStatus(appointmentToEdit.paymentStatus ?? "");
      setPaidAmount(appointmentToEdit.paidAmount ?? "");
    }
  }, [appointmentToEdit]);

  // Fetch working hours based on selected patient (for available days)
  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (patientId === "") {
        setAvailableDays([]);
        setDate(undefined);
        setAvailableTimeSlots([]);
        return;
      }

      try {
        const selectedPatient = patientRecord.find((p) => p.id === patientId);

        if (selectedPatient?.psychologist?.id === null) {
          setError("Selected patient has no assigned psychologist");
          setAvailableDays([]);
          return;
        }

        const workingHoursData: WorkingHours[] =
          await getWorkingHoursByIdAction(
            selectedPatient?.psychologist?.id ?? 0
          );

        const safeWorkingHours: WorkingHours[] = (workingHoursData ?? []).map(
          (wh) => ({
            ...wh,
            available: wh?.available || { slots: [], dayOfWeek: [] },
            days: wh?.available?.dayOfWeek ?? [],
          })
        );

        const days = new Set<string>();
        safeWorkingHours.forEach((wh) => {
          wh.available?.slots?.forEach((day) => days.add(day as string));
        });

        setAvailableDays(Array.from(days) as DayOfWeek[]);
      } catch {
        setError("");
        setAvailableDays([]);
      }
    };

    fetchWorkingHours();
  }, [patientId, patientRecord]);

  // Fetch all slots and busy slots based on selected patient and date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!patientId || !date) {
        setAvailableTimeSlots([]);
        setTime("");
        return;
      }

      try {
        const selectedPatient = patientRecord.find((p) => p.id === patientId);
        if (!selectedPatient?.psychologist?.id) {
          setAvailableTimeSlots([]);
          return;
        }

        const psychologistId = selectedPatient.psychologist.id;
        const formattedDate = format(date, "yyyy-MM-dd");

        let todaytime = null;
        const now = new Date();

        let currentHour: string = (now.getHours() + 1).toString();
        currentHour = currentHour.toString().padStart(2, "0") + ":00:00";
        const selectedDate = new Date(date);
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (selectedDate.toDateString() === today.toDateString()) {
          todaytime = `00 - ${currentHour}`;
        }

        const allSlots = await getAllSlotsAction(psychologistId, formattedDate);

        const busySlots = await getBusySlotsAction(
          psychologistId,
          formattedDate
        );
        const initialBlockedTiming = await getBlockedTimingAction();

        const dayName = date
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase();

        const blockArr = [];

        initialBlockedTiming[0]?.blockedTiming
          ?.filter((data) => data.dayOfWeek === dayName)
          .forEach((data) => {
            (data?.slots ?? []).forEach((slot) => {
              const formattedSlot = `${slot.startTime} - ${slot.endTime}`;
              blockArr.push(formattedSlot);
            });
          });
        if (todaytime != null) {
          blockArr.push(todaytime);
        }

        const mergedArray = Array.from(new Set([...busySlots, ...blockArr]));

        const parseRange = (range: string): TimeRange => {
          const [start, end] = range
            .split(" - ")
            .map((time) => parseInt(time, 10));
          return { start, end };
        };

        const normalizeTimeRanges = (ranges: string[]): string[] => {
          const parsedRanges: TimeRange[] = ranges.map(parseRange);
          parsedRanges.sort((a, b) => a.start - b.start);

          const mergedRanges: TimeRange[] = [];

          for (const range of parsedRanges) {
            if (
              !mergedRanges.length ||
              mergedRanges[mergedRanges.length - 1].end < range.start
            ) {
              mergedRanges.push(range);
            } else {
              mergedRanges[mergedRanges.length - 1].end = Math.max(
                mergedRanges[mergedRanges.length - 1].end,
                range.end
              );
            }
          }
          return mergedRanges.map(({ start, end }) => `${start} - ${end}`);
        };

        const removeBlockedSlots = (
          slots: string[],
          blockedRanges: TimeSlot[]
        ): string[] => {
          return slots.filter((slot) => {
            const [slotStart, slotEnd] = slot
              .split(" - ")
              .map((time) => parseInt(time, 10));
            return !blockedRanges.some(
              ({ start, end }) => slotStart >= start && slotEnd <= end
            );
          });
        };

        const normalizedMergedArray = normalizeTimeRanges(
          mergedArray.map((slot) =>
            slot.replace(/:00/g, "").replace(/^(\d)$/, "0$1")
          )
        );
        const blockedRanges = normalizedMergedArray.map(parseRange);
        const normalizedAllSlots = allSlots.map((slot) =>
          slot.replace(/:00/g, "")
        );
        const availableSlots = removeBlockedSlots(
          normalizedAllSlots,
          blockedRanges
        );
        setAvailableTimeSlots(availableSlots);
      } catch {
        setError("Failed to fetch time slots");
        setAvailableTimeSlots([]);
      }
    };

    fetchSlots();
  }, [date, patientId, patientRecord]);

  // Fetch available rooms based on date, time, and branchId
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!date || !time || !branchId) {
        setFilteredRooms([]);
        setRoomName("");
        return;
      }

      try {
        const [startTimeStr, endTimeStr] = time.split(" - ");
        const formattedDate = format(date, "yyyy-MM-dd");
        const availableRooms = await getAvailableRoomsAction(
          formattedDate,
          startTimeStr,
          endTimeStr,
          branchId
        );

        setFilteredRooms(availableRooms);
        if (!availableRooms.some((room) => room.name === roomName)) {
          setRoomName("");
        }
      } catch (err) {
        setError(
          "Failed to fetch available rooms: " +
          (err instanceof Error ? err.message : String(err))
        );
        setFilteredRooms([]);
      }
    };

    fetchAvailableRooms();
  }, [date, time, branchId]);

  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date()); // Normalize today's date
    const maxDate = addDays(today, daysLimit);

    if (date < today || date > maxDate) return true; // Ensure we compare only dates

    if (availableDays.length === 0) return false;
    const dayOfWeek = format(date, "EEEE").toUpperCase() as DayOfWeek;
    return !availableDays.includes(dayOfWeek);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const selectedPatient = patientRecord.find((c) => c.id === patientId);
      const selectedBranch = branches.find((b) => b.id === branchId);
      const selectedRoom = filteredRooms.find((r) => r.name === roomName);

      // if (!selectedPatient) throw new Error("Please select a valid patient");
      if (!date) throw new Error("Please select a date");
      if (!time) throw new Error("Please select a time slot");
      if (!branchId) throw new Error("Please select a branch");
      if (!roomName || !selectedRoom) throw new Error("Please select a room");
      if (!paymentStatus) throw new Error("Please select a payment status");
      if (
        paymentStatus === PaymentStatus.PARTIALLY_PAID &&
        (paidAmount === "" || isNaN(Number(paidAmount)))
      )
        setPaidAmount(0);
      if (
        paymentStatus === PaymentStatus.PARTIALLY_PAID &&
        Number(paidAmount) > Number(totalFee)
      )
        throw new Error("Paid amount cannot exceed total fee");

      const [startTimeStr, endTimeStr] = time.split(" - ");
      const formattedDate = format(date, "yyyy-MM-dd");
      const startTime = `${formattedDate}T${startTimeStr}:00`;
      const endTime = `${formattedDate}T${endTimeStr}:00`;

      const effectivePaidAmount =
        paymentStatus === PaymentStatus.PARTIALLY_PAID
          ? Number(paidAmount) || 0
          : undefined;

      const appointmentData: Appointment = {
        id: appointmentToEdit?.id ?? 0,
        startTime,
        endTime,
        patient: selectedPatient as Patient,
        psychologist: selectedPatient?.psychologist as Psychologist,
        roomId: selectedRoom?.id || 0,
        roomName: selectedRoom.name,
        branchId: branchId,
        branchName: selectedBranch!.name,
        status: appointmentToEdit?.status ?? AppointmentStatus.SCHEDULED,
        totalFee: Number(selectedPatient?.fee),
        paymentStatus: paymentStatus as PaymentStatus,
        paidAmount: effectivePaidAmount,
        remainingAmount:
          paymentStatus === PaymentStatus.PENDING
            ? Number(selectedPatient?.fee)
            : paymentStatus === PaymentStatus.COMPLETED
              ? 0
              : Number(0),
        patientPayment: {
          paymentStatus: paymentStatus as PaymentStatus,
          totalFee: Number(selectedPatient?.patientFee),
          paidAmount: effectivePaidAmount,
          remainingAmount:
            paymentStatus === PaymentStatus.PENDING
              ? Number(selectedPatient?.patientFee)
              : paymentStatus === PaymentStatus.COMPLETED
                ? 0
                : Number(0),
        },
      };
      const response = appointmentToEdit
        ? await updateAppointmentAction(appointmentData)
        : await addAppointmentAction(appointmentData);

      if (appointmentToEdit && onAppointmentUpdated) {
        onAppointmentUpdated(response);
      } else if (onAppointmentAdded) {
        onAppointmentAdded(response);
      }

      setDate(undefined);
      setTime("");
      setPatientId("");
      setRoomName("");
      setBranchId("");
      setTotalFee(0);
      setPaymentStatus("");
      setPaidAmount("");
      if (onClose) onClose();
    } catch (err) {
      if (err instanceof Error && "message" in err) {
        try {
          const errorObj = JSON.parse(err.message);
          const errorMessage = `${errorObj.details} (Path: ${errorObj.path})`;
          setError(errorMessage);
        } catch {
          setError("Failed to process appointment: " + err.message);
        }
      } else {
        setError("Failed to process appointment");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    setDate(undefined);
    setTime("");
    setPatientId("");
    setRoomName("");
    setBranchId("");
    setTotalFee(0);
    setPaymentStatus("");
    setPaidAmount("");
    setError(null);
    if (onClose) onClose();
  };

  const getFilteredStatuses = () => {
    return [PaymentStatus.PENDING, PaymentStatus.COMPLETED];
  };
  
  const statusLabels = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Beklemede",
      COMPLETED: "Tamamlandı",
    };
  
    return labels[status] ?? status;
  };
  
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <DialogContent>
        {appointmentToEdit?.assignedByAdmin &&
          !isAdmin &&
          appointmentToEdit &&
          appointmentToEdit?.patient?.isAssignByAdmin ? (
          <p className="text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 p-3">
            Randevu detayları düzenlenemez
          </p>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {appointmentToEdit ? "Randevuyu Düzenle" : "Yeni Randevu Ekle"}

              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div
                className="flex flex-col gap-6 py-4 max-h-[60vh] overflow-y-auto"
                style={{ maxHeight: "60vh" }}
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {/* Patient Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="patient">Hasta</Label>
                  <Select
                    value={patientId === "" ? undefined : String(patientId)}
                    onValueChange={(value) =>
                      setPatientId(value ? parseInt(value) : "")
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="patient" className="w-full">
                      <SelectValue placeholder="Hastaları ara" />
                    </SelectTrigger>
                    <SelectContent>
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Hastaları ara..."
                          onValueChange={handleSearchChange}
                        />
                        <CommandList>
                          {patientRecord.length <= 0 && search !== "" ? (
                            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
                          ) : (
                            <CommandGroup>
                              {patientRecord.map((patient) => (
                                <SelectItem
                                  key={patient.id}
                                  value={String(patient.id)}
                                >
                                  {patient.firstName} {patient.lastName}
                                </SelectItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </SelectContent>
                  </Select>
                </div>
                {/* Date Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="date">Tarih</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isLoading || patientId === ""}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Bir tarih seçin</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      locale={tr}
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => setDate(newDate)}
                        disabled={isDateDisabled}
                        initialFocus
                        fromDate={subDays(new Date(), 1)}
                        toDate={addDays(new Date(), daysLimit)}
                      />
                    </PopoverContent>
                  </Popover>
                  {availableDays.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Available days:{" "}
                      {availableDays
                        .map(
                          (day) => day.charAt(0) + day.slice(1).toLowerCase()
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
                {/* Time Slot Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="time">Zaman Dilimi</Label>
                  <Select
                    value={time}
                    onValueChange={setTime}
                    disabled={
                      isLoading || !date || availableTimeSlots.length === 0
                    }
                  >
                    <SelectTrigger id="time" className="w-full">
                      <SelectValue placeholder="Bir zaman dilimi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {(appointmentToEdit
                        ? [...availableTimeSlots, time]
                        : availableTimeSlots
                      ).map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {date && availableTimeSlots.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Bu gün için uygun zaman dilimi yok.
                    </p>
                  )}
                </div>
                {/* Branch Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="branch">Şube</Label>
                  <Select
                    value={branchId === "" ? undefined : String(branchId)}
                    onValueChange={(value) =>
                      setBranchId(value ? parseInt(value) : "")
                    }
                    disabled={isLoading || branches.length === 0}
                  >
                    <SelectTrigger id="branch" className="w-full">
                      <SelectValue placeholder="Bir şube seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Room Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="room">Oda</Label>
                  <Select
                    value={roomName}
                    onValueChange={setRoomName}
                    disabled={
                      isLoading || branchId === "" || filteredRooms.length === 0
                    }
                  >
                    <SelectTrigger id="room" className="w-full">
                      <SelectValue placeholder="Bir oda seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredRooms.map((room) => (
                        <SelectItem key={room.id} value={room.name}>
                          {room.name} (Floor {room.floorNumber}, Rate: $
                          {room.hourlyRate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {branchId && filteredRooms.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Seçilen zamanda bu şube için uygun oda bulunmamaktadır.
                    </p>
                  )}
                </div>

                {/* Payment Status */}
                <div className="grid gap-2">
                  <Label htmlFor="paymentStatus">Ödeme Durumu</Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={(value) =>
                      setPaymentStatus(value as PaymentStatus)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="paymentStatus" className="w-full">
                      <SelectValue placeholder="Ödeme durumunu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredStatuses().map((statusOption) => (
                        <SelectItem key={statusOption} value={statusOption}>
                       {statusLabels(statusOption)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Paid Amount (Conditional) */}
                {paymentStatus === PaymentStatus.PARTIALLY_PAID && (
                  <div className="grid gap-2">
                    <Label htmlFor="paidAmount">Ödenen Tutar</Label>
                    <Input
                      id="paidAmount"
                      type="number"
                      value={paidAmount}
                      onChange={(e) =>
                        setPaidAmount(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      disabled={isLoading}
                      min="0"
                      step="0.01"
                      max={totalFee as number}
                      placeholder="Ödenen tutarı girin (varsayılan 0)"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              {/* Form Footer */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  İptal Et
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? appointmentToEdit
                      ? "Randevu Güncelleniyor..."
                      : "Randevu Ekleniyor..."
                    : appointmentToEdit
                      ? "Randevuyu Güncelle"
                      : "Randevu Ekle"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </div>
  );
}
