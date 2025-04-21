// src/lib/apiUtils.ts

type ApiResult<T> = { success: true; data: T } | { success: false; error: unknown };

export async function callApi<T>(apiCall: () => Promise<T>): Promise<ApiResult<T>>
{
  try
  {
    const data = await apiCall();
    return {success: true, data};
  } catch (error: unknown)
  {
    let errorData;
    try
    {
      errorData = JSON.parse((error as Error).message); // Parse the JSON-stringified error
    } catch
    {
      errorData = {message: (error as Error).message || "An unexpected error occurred"};
    }
    return {success: false, error: errorData};
  }
}