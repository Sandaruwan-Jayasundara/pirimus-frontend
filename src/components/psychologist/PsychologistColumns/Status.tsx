import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Psychologist } from "@/type/psychologist";
import { useRouter } from "next/navigation";
import { updatePsychologistStatusAction } from "@/api/PsychologistApi"; // Added new action
type Props = {
  psychologist: Psychologist;
};

const Status: React.FC<Props> = ({ psychologist }) => {
  const router = useRouter();
  return (
    <div className="text-right">
      <Select
        value={psychologist.status}
        onValueChange={async (value) => {
          const newStatus = value as "ACTIVE" | "INACTIVE";
          try {
            await updatePsychologistStatusAction(psychologist.id, newStatus);
            psychologist.status = newStatus;
            router.refresh();
          } catch (error) {
            console.error("Durum güncellenirken hata oluştu", error);
          }
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="ACTIVE">AKTİF</SelectItem>
        <SelectItem value="INACTIVE">PASİF</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Status;
