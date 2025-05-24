"use client";
import React, { useEffect } from "react";
import { Psychologist } from "@/type/psychologist";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columns } from "./CheckAvailabilityColumns";
import { Patient } from "@/type/patient";
import { getRoomByDateAndTime } from "@/api/AppointmentApi";
import { getWorkingHoursByIdAction } from "@/api/WorkingHoursApi";
import { getBlockedTimingAction } from "@/api/BlockedTimingApi";
import { AvailabilityTable } from "./AvailabilityTable";
import { PatientPayment } from "@/type/PatientPayment";
import { WorkingHours } from "@/type/WorkingHours";
import { tr } from 'date-fns/locale';

interface CheckAvailabilityTableProps<TData> {
  title: string;
  psychologistData: TData[];
}
interface BlockedRange {
  start: number;
  end: number;
}

interface SearchAvailabilityParams {
  timeDate: Date | undefined;
  time: string;
  psychologistId: string;
}

interface RoomData {
  psyAvailability: string;
  id: number;
  startTime: string;
  endTime: string;
  patient: Patient;
  psychologist?: Psychologist;
  roomId: number;
  roomName: string;
  branchId: number;
  patientPayment?: PatientPayment;
}

export function CheckAvailabilityTable<TData extends Psychologist>({
  title,
  psychologistData,
}: CheckAvailabilityTableProps<TData>) {
  const [timeDate, setTimeData] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>(
    []
  );
  const [roomData, setRoomData] = React.useState<
    {
      psyAvailability: string;
      id: number;
      startTime: string;
      endTime: string;
      patient: Patient;
      psychologist?: Psychologist;
      roomId: number;
      roomName: string;
      branchId: number;
      patientPayment?: PatientPayment;
    }[]
  >([]);

  useEffect(() => {
    setRoomData([
      {
        psyAvailability: "initial",
        id: 0,
        startTime: "",
        endTime: "",
        patient: {} as Patient,
        psychologist: undefined,
        roomId: 0,
        roomName: "",
        branchId: 0,
        patientPayment: undefined,
      },
    ]);
  }, []);

  const [psychologistId, setPsychologist] = React.useState("");
  // Fetch all slots and busy slots based on selected patient and date
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const allSlots = [
          "00 - 01",
          "01 - 02",
          "02 - 03",
          "03 - 04",
          "04 - 05",
          "05 - 06",
          "06 - 07",
          "07 - 08",
          "08 - 09",
          "09 - 10",
          "10 - 11",
          "11 - 12",
          "12 - 13",
          "13 - 14",
          "14 - 15",
          "15 - 16",
          "16 - 17",
          "17 - 18",
          "18 - 19",
          "19 - 20",
          "20 - 21",
          "21 - 22",
          "22 - 23",
        ];

        const blockArr = [];
        let todaytime = null;
        const mergedRanges: { start: number; end: number }[] = [];

        const now = new Date();
        let currentHour: string = (now.getHours() + 1).toString();
        currentHour = currentHour.toString().padStart(2, "0") + ":00:00";

        const selectedDate = new Date(timeDate || new Date());
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (selectedDate.toDateString() === today.toDateString()) {
          todaytime = `00 - ${currentHour}`;
        }

        const initialBlockedTiming = await getBlockedTimingAction();
        const dayName = timeDate
          ? timeDate
              .toLocaleDateString("en-US", { weekday: "long" })
              .toUpperCase()
          : "";

        initialBlockedTiming[0]?.blockedTiming
          ?.filter((data) => data.dayOfWeek === dayName)
          .forEach((data) => {
            data?.slots?.forEach((slot) => {
              const formattedSlot = `${slot.startTime} - ${slot.endTime}`;
              blockArr.push(formattedSlot);
            });
          });
        if (todaytime != null) {
          blockArr.push(todaytime);
        }

        const parseRange = (range: string): TimeRange => {
          const [start, end] = range
            .split(" - ")
            .map((time) => parseInt(time, 10));
          return { start, end };
        };

        interface TimeRange {
          start: number;
          end: number;
        }

        const normalizeTimeRanges = (ranges: string[]): string[] => {
          const parsedRanges: TimeRange[] = ranges.map(parseRange);
          parsedRanges.sort((a, b) => a.start - b.start);

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
          blockedRanges: BlockedRange[]
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
          blockArr.map((slot) =>
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
        setAvailableTimeSlots([]);
      }
    };
    fetchSlots();
  }, [timeDate]);

  const searchAvailability = async (
    timeDate: SearchAvailabilityParams["timeDate"],
    time: SearchAvailabilityParams["time"],
    psychologistId: SearchAvailabilityParams["psychologistId"]
  ): Promise<void> => {
    if (timeDate && time && psychologistId) {
      const room: RoomData[] = (await getRoomByDateAndTime(timeDate, time)).map(
        (appointment) => ({
          ...appointment,
          psyAvailability: "Unknown",
        })
      );
      const psychologistResponse: WorkingHours[] =
        await getWorkingHoursByIdAction(Number(psychologistId) || 0);
      if (room || psychologistResponse.length > 0) {
        const dayName = new Date(timeDate)
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase();
        const [inputStartRaw, inputEndRaw] = time.split("-");

        // Check each psychologist
        const results = psychologistResponse?.map((psychologist) => {
          // const workingHours = psychologist.available?.dayOfWeek?.includes(dayName)? psychologist.available: undefined;
          const workingHours = Array.isArray(psychologist.available)
            ? psychologist.available.find(
                (day: {
                  dayOfWeek: string;
                  slots: { startTime: string; endTime: string }[];
                }) => day.dayOfWeek === dayName
              )
            : undefined;

          if (workingHours) {
            const timeResult: boolean[] = (workingHours?.slots ?? []).map(
              (slot: { startTime: string; endTime: string }) => {
                const startTime: string = slot?.startTime?.split(":")[0];
                const endTime: string = slot?.endTime?.split(":")[0];
                const isWithinRange: boolean =
                  Number(inputStartRaw) >= Number(startTime) &&
                  Number(inputEndRaw) <= Number(endTime);

                return isWithinRange;
              }
            );

            return timeResult?.some((result: boolean) => result === true)
              ? "AVAILABLE"
              : "Unavailable";
          } else {
            return "Unavailable";
          }
        });
        setRoomData(
          room.map((item) => ({
            ...item,
            psyAvailability: results[0] ? results[0] : "Unavailable",
          }))
        );
      } else {
        setRoomData([{ psyAvailability: "Unavailable" } as RoomData]);
      }
    } else {
      setRoomData([]);
    }
  };

  return (
    <>
      <div className="flex w-full justify-end items-center mb-4 border p-3">
        {/* Time Slot Selection */}
        <div className="grid gap-2 me-4">
          <Select value={psychologistId} onValueChange={setPsychologist}>
            <SelectTrigger id="psychologist" className="w-full bg-primary/10">
              <SelectValue placeholder="Bir psikolog seçin" />
            </SelectTrigger>
            <SelectContent>
              {psychologistData.map((psy, index) => (
                <SelectItem key={index} value={psy.id.toString()}>
                  {psy.firstName} {psy.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] text-left bg-primary/10">
              {timeDate ? format(timeDate, "PPP") : "Bir tarih seçin"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={timeDate}
              onSelect={setTimeData}
              locale={tr}
            />
          </PopoverContent>
        </Popover>

        {/* Time Slot Selection */}
        <div className="grid gap-2 ms-4">
          <Select value={time} onValueChange={setTime} disabled={!timeDate}>
            <SelectTrigger id="time" className="w-full bg-primary/10">
              <SelectValue placeholder="Bir zaman dilimi seçin" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md ms-2"
          disabled={!psychologistId || !timeDate || !time}
          onClick={() => searchAvailability(timeDate, time, psychologistId)}
        >
          Ara
        </Button>
      </div>
      <AvailabilityTable title={title} columns={columns} data={roomData} />
    </>
  );
}
