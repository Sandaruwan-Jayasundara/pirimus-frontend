// serverAuth.tsx
'use server';
import {cookies} from "next/headers";

export const getServerAuth = async () => {
  // Get cookies fresh for each call instead of caching
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  if (!token)
  {
    throw new Error("No authentication token found");
  }

  const logout = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    try
    {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error)
    {
      console.error("Logout failed:", error);
    }
    // Clear the token cookie
    const updatedCookieStore = await cookies();
    updatedCookieStore.delete("token");
  };

  return {token, logout};
};