"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

import { Patient, PatientStatus } from "@/type/patient";
import { Psychologist } from "@/type/psychologist";
import { searchPsychologist } from "@/api/PsychologistApi";
import { addPatientAction, updatePatientAction } from "@/api/PatientApi";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/type/role";
import { formatPhoneNumber } from "@/lib/phoneUtils";
import { Textarea } from "@/components/ui/textarea";

interface PatientFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onPatientAdded?: (patient: Patient) => void;
  onPatientUpdated?: (patient: Patient) => void;
  onClose?: () => void;
  patientToEdit?: Patient | null;
}

export function PatientForm({
  className,
  onPatientAdded,
  onPatientUpdated,
  onClose,
  patientToEdit,
  ...props
}: PatientFormProps) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fee, setFee] = useState("");
  const [patientFee, setPatientFee] = useState<string | null>(null);
  const [psychologistId, setPsychologistId] = useState<number | "">("");
  const [clientNotes, setClientNotes] = useState("");
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === Role.ADMIN;
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadPsychologists = async (search: string) => {
      try {
        const data = await searchPsychologist(search);
        setPsychologists(data);
      } catch {
        setPsychologists([]);
      }
    };
    if (isAdmin) loadPsychologists(search);
  }, [isAdmin, search]);

  useEffect(() => {
    if (patientToEdit) {
      setFirstName(patientToEdit.firstName);
      setLastName(patientToEdit.lastName);
      setEmail(patientToEdit.email);
      setPhone(patientToEdit.phone);
      setFee(patientToEdit.fee.toString());
      setPatientFee(patientToEdit.patientFee?.toString() || null);
      setPsychologists(patientToEdit.psychologist ? [patientToEdit.psychologist] : []);
      setPsychologistId(patientToEdit.psychologist?.id || "");
      // Only set clientNotes if not admin
      if (!isAdmin) {
        setClientNotes(patientToEdit.clientNotes || "");
      }
    }
  }, [patientToEdit, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const patientData: Patient = {
        id: patientToEdit?.id || 0,
        firstName,
        lastName,
        email,
        phone: phone,
        fee: parseFloat(fee),
        patientFee: parseFloat(patientFee ? patientFee : fee),
        status: patientToEdit?.status || PatientStatus.ACTIVE,
        isAssignByAdmin: isAdmin,
        ...(isAdmin && psychologistId
          ? { psychologist: psychologists.find((p) => p.id === psychologistId) }
          : patientToEdit?.psychologist
            ? { psychologist: patientToEdit.psychologist }
            : {}),
        // Only include clientNotes if not admin
        ...(!isAdmin ? { clientNotes } : {}),
      };

      const response = patientToEdit
        ? await updatePatientAction(patientData)
        : await addPatientAction(patientData);

      if (patientToEdit && onPatientUpdated) {
        onPatientUpdated(response);
      } else if (onPatientAdded) {
        onPatientAdded(response);
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setFee("");
      setPatientFee("");
      setPsychologistId("");
      setClientNotes("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process patient"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setFee("");
    setPatientFee("");
    setPsychologistId("");
    setClientNotes("");
    setError(null);
    if (onClose) onClose();
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <DialogContent>
          {patientToEdit?.isAssignByAdmin && !isAdmin && patientToEdit ? (
            <p className="text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 p-3">
              Cannot edit Patient details
            </p>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  {patientToEdit ? "Hasta Düzenle" : "Yeni Hasta Ekle"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6 py-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Adınızı girin"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Soyadınızı girin"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-posta adresinizi girin"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0 (555) 123 45 67"
                      pattern="0 \(\d{3}\) \d{3} \d{2} \d{2}"
                      maxLength={17}
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatPhoneNumber(e.target.value));
                      }}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Conditionally render Client Notes field only for non-admins */}
                  {!isAdmin && (
                    <div className="grid gap-2">
                      <Label htmlFor="clientNotes">
                        Danışan Notları (İsteğe bağlı)
                      </Label>
                      <Textarea
                        id="clientNotes"
                        placeholder="Danışan notlarını girin"
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        disabled={isLoading}
                        className="w-full p-2 border rounded-md"
                        rows={4}
                      />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="grid gap-2">
                      <Label htmlFor="psychologist">Psikolog</Label>
                      <Select
                        value={
                          psychologistId === ""
                            ? undefined
                            : String(psychologistId)
                        }
                        onValueChange={(value) =>
                          setPsychologistId(parseInt(value))
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger id="patient" className="w-full">
                          <SelectValue placeholder="Bir hasta seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Psikologları ara..."
                              onValueChange={setSearch}
                            />
                            <CommandList>
                              {psychologists.length === 0 && search !== "" ? (
                                <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
                              ) : (
                                <CommandGroup>
                                  {psychologists?.map((psychologist) => (
                                    <SelectItem
                                      key={psychologist.id}
                                      value={String(psychologist.id)}
                                    >
                                      {`${psychologist.firstName} ${psychologist.lastName}`}
                                    </SelectItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="fee">Psikolog Ücreti</Label>
                    <Input
                      id="fee"
                      type="number"
                      step="0.01"
                      placeholder="Hasta ücretini girin"
                      required
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {isAdmin && (
                    <div className="grid gap-2">
                      <Label htmlFor="fee">Psikolog Ücreti</Label>
                      <Input
                        id="patientFee"
                        type="number"
                        step="0.01"
                        placeholder="Hasta ücretini girin"
                        required
                        value={patientFee ?? ""}
                        onChange={(e) => setPatientFee(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>

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
                      ? patientToEdit
                        ? "Hasta Güncelleniyor..."
                        : "Hasta Ekleniyor..."
                      : patientToEdit
                        ? "Hastayı Güncelle"
                        : "Hasta Ekle"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </div>
    </>
  );
}
