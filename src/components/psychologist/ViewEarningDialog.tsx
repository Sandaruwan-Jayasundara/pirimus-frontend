"use client";
import React, {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {getAdminAssignedEarningsAction, getNonAdminAssignedEarningsAction} from "@/api/PatientApi";

interface ViewEarningsDialogProps {
  psychologistId: number;
}

const ViewEarningsDialog: React.FC<ViewEarningsDialogProps> = ({psychologistId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminEarnings, setAdminEarnings] = useState<number | null>(null);
  const [nonAdminEarnings, setNonAdminEarnings] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch earnings
  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try
    {
      const adminData = await getAdminAssignedEarningsAction(psychologistId);
      const nonAdminData = await getNonAdminAssignedEarningsAction(psychologistId);
      setAdminEarnings(adminData);
      setNonAdminEarnings(nonAdminData);
    } catch (err)
    {
      setError("Failed to fetch earnings. Please try again.");
      console.error(err);
    } finally
    {
      setLoading(false);
    }
  };

  // Handle dialog open
  const handleOpen = async () => {
    setIsOpen(true);
    if (adminEarnings === null && nonAdminEarnings === null)
    {
      // Only fetch if we haven't fetched yet
      await fetchEarnings();
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (open)
        {
          handleOpen();
        } else
        {
          setIsOpen(false);
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-yellow-500/10">
          Kazançları Görüntüle
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Psikolog Kimliği İçin Kazançlar: {psychologistId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loading ? (
                <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
            ) : (
                <>
                  <div>
                    <h3 className="font-medium">Danışan Yönlendirme Kazancı</h3>
                    <p className="text-sm">₺{adminEarnings?.toFixed(2) ?? "0.00"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Oda Kiralama Kazançları</h3>
                    <p className="text-sm">₺{nonAdminEarnings?.toFixed(2) ?? "0.00"}</p>
                  </div>
                </>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default ViewEarningsDialog;