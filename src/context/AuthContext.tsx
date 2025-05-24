// auth-context.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/AuthService";
import { User } from "@/type/user";
import { Role } from "@/type/role";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility to get cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Utility to delete cookie by name
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getCookie("token");
    const storedUser = getCookie("user");
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });

      // Show success toast (redirect handled in AuthContext)
      toast.success("Giriş Başarılı", {
        description: "Hoş geldiniz! Şimdi giriş yaptınız.",
      });
      
      document.cookie = `token=${response.jwtToken}; path=/;`;
      const userData: User = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        phoneNumber: response.phoneNumber,
      };

      document.cookie = `user=${JSON.stringify(userData)}; path=/;`;

      setToken(response.jwtToken);
      setUser(userData);
      setIsAuthenticated(true);

      if (userData.role === Role.ADMIN) {
        router.push("/dashboard");
      } else {
        router.push("/psychologist-dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  const getToken = () => {
    return token || getCookie("token");
  };

  const signOut = async () => {
    try {
      const currentToken = getToken();
      if (currentToken) {
        const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }

      deleteCookie("token");
      deleteCookie("user");

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      deleteCookie("token");
      deleteCookie("user");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        signOut,
        getToken,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
