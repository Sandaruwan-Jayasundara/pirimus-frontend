"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import {AuthService} from "@/lib/AuthService";
import {formatPhoneNumber} from "@/lib/phoneUtils";

export function Account()
{
  const {user, setUser} = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "phoneNumber" ? formatPhoneNumber(value) : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id === "current" ? "currentPassword" : "newPassword"]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try
    {
      const response = await AuthService.updateProfile(formData);

      // Update cookies
      document.cookie = `token=${response.jwtToken}; path=/;`;
      const userData = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        phoneNumber: Number(response.phoneNumber),
      };
      document.cookie = `user=${JSON.stringify(userData)}; path=/;`;

      // Update context
      setUser(userData);

      alert("Account updated successfully!");
    } catch (error)
    {
      console.error("Error updating account:", error);
      alert("Failed to update account.");
    }
  };

  const handleChangePassword = async () => {
    try
    {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.split('token=')[1].split(';')[0]}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (!response.ok) throw new Error("Failed to change password");
      const result = await response.text();
      alert(result);
      setPasswordData({currentPassword: "", newPassword: ""});
    } catch (error)
    {
      console.error("Error changing password:", error);
      alert(error instanceof Error ? error.message : "Failed to change password.");
    }
  };

  return (
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Hesap</TabsTrigger>
          <TabsTrigger value="password">Şifre</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad</Label>
            <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Telefon Numarası</Label>
            <Input
                id="phoneNumber"
                type="tel"
                maxLength={17}
                value={formData.phoneNumber}
                placeholder="0 (555) 123 45 67"
                pattern="0 \(\d{3}\) \d{3} \d{2} \d{2}"
                onChange={handleInputChange}
                title="Phone number format: 0 (555) 123 45 67"
            />
          </div>
          <Button onClick={handleSaveChanges}>Değişiklikleri Kaydet</Button>
        </TabsContent>

        <TabsContent value="password" className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="current">Mevcut Şifre</Label>
            <Input
                id="current"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">Yeni Şifre</Label>
            <Input
                id="new"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
            />
          </div>
          <Button onClick={handleChangePassword}>Şifreyi Kaydet</Button>
        </TabsContent>
      </Tabs>
  );
}