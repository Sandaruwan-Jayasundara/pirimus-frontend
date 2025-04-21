// AuthService.tsx
import { User } from "@/type/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedInUserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: number;
  jwtToken: string;
}

export interface SignupResponse {
  message: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string | number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://92.205.29.121:8081";

// Utility to get cookie by name (moved here for convenience)
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoggedInUserDTO> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid email or password");
      } else if (response.status === 423) {
        throw new Error("Under Reviewing. Your account is not active.");
      } else {
        throw new Error("Login failed. Please try again later.");
      }
    }

    return response.json();
  },

  signup: async (userData: User): Promise<SignupResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        console.log("400", response.status);

        throw new Error("Invalid user data. Please check your inputs.");
      } else if (response.status === 403) {
        console.log("403", response.status);

        throw new Error(
          "This account has been deleted. Please contact support."
        );
      } else if (response.status === 404) {
        console.log("404", response.status);
        throw new Error("No account found with this email. Please sign up.");
      } else {
        console.log("else", response.status);

        throw new Error("Login Failed. Please try again later.");
      }
    }

    return response.json();
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<LoggedInUserDTO> => {
    const token = getCookie("token");
    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to update profile");
    }

    return response.json();
  },
};
