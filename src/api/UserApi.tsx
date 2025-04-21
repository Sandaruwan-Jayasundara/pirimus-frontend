"use server";
import {serverApi} from "@/lib/serverApi";

export const serverUserApi = async () => {
  const {put} = await serverApi();

  const changePassword = (oldPassword: string, newPassword: string) =>
      put<string>("/auth/change-password", {oldPassword, newPassword});

  return {
    changePassword,
  };
};

// Server Action to change the password
export async function changePasswordAction(oldPassword: string, newPassword: string)
{
  const {changePassword} = await serverUserApi();
  const result = await changePassword(oldPassword, newPassword);
  return result; // Returns the success message (e.g., "Password changed successfully")
}