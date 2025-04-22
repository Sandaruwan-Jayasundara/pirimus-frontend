// serverApi.ts
import {getServerAuth} from "@/lib/serverAuth";

const API_BASE_URL =process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiServer = (getToken: () => string | null, logout: () => Promise<void> | void) => {
  const handleRequest = async (method: "GET" | "POST" | "PUT" | "DELETE", url: string, data?: unknown) => {
    const token = getToken();
    if (!token)
    {
      throw new Error("No authentication token found");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok)
    {
      if (response.status === 401)
      {
        await logout();
        throw new Error("Session expired. Please log in again.");
      }
      const errorData = responseText ? JSON.parse(responseText) : {message: `API request failed: ${response.statusText}`};
      throw new Error(JSON.stringify(errorData)); // Ensure the error is JSON-stringified for parsing later
    }

    return responseText ? JSON.parse(responseText) : undefined;
  };

  const get = async <T>(url: string): Promise<T> => handleRequest("GET", url);
  const post = async <T, D = unknown>(url: string, data?: D): Promise<T> => handleRequest("POST", url, data);
  const put = async <T, D = unknown>(url: string, data?: D): Promise<T> => handleRequest("PUT", url, data);
  const del = async <T>(url: string): Promise<T> => handleRequest("DELETE", url);

  return {get, post, put, del};
};

export const serverApi = async () => {
  const {token, logout} = await getServerAuth();
  const getToken = () => token;
  return apiServer(getToken, logout);
};