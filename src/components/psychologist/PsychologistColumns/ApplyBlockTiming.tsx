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
import { updatePsychologistBlockTimingAction } from "@/api/PsychologistApi"; // Added new action
type Props = {
  psychologist: Psychologist;
};

const ApplyBlockTiming: React.FC<Props> = ({ psychologist }) => {

        const router = useRouter();
        return (
            <div className="text-right">
              <Select
                  value={psychologist.applyBlockTiming ? "Yes" : "No"}
                  onValueChange={async (value) => {
                    const newValue = value === "Yes";
                    try
                    {
                      await updatePsychologistBlockTimingAction(psychologist.id, newValue);
                      psychologist.applyBlockTiming = newValue;
                      router.refresh();
                    } catch (error)
                    {
                      console.error("Error updating apply block timing:", error);
                    }
                  }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select option"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
        );
};

export default ApplyBlockTiming;
