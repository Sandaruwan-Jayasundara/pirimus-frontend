"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
//import ReCAPTCHA from "react-google-recaptcha";

// Zod schema for login form
const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  // const [captchaRefresh, setCaptchaRefresh] = useState(true);
  // const [isClient, setIsClient] = useState(false);
  // const [captchaValue, setCaptchaValue] = useState("");
  const [formErrors, setFormErrors] = useState("");
  // useEffect(() => {
  //   // Set isClient to true when the component is mounted on the client
  //   setIsClient(true);
  // }, []);

  // Initialize form with react-hook-form and zod
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const handleCaptchaChange = (value: string) => {
  //   setCaptchaValue(value);
  // };

  const handleSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    // if (!captchaValue) {
    //   setFormErrors("Please verify that you are not a robot");
    //   return;
    // }
    setIsLoading(true);
    setFormErrors("");
    // setCaptchaRefresh(false);
    try {
      // Call the login function from AuthContext
      await login(data.email, data.password);
      // setCaptchaRefresh(true);
    } catch (err) {
      // setCaptchaRefresh(false);
      toast.error("Login Failed", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      // setCaptchaRefresh(true);
      // setCaptchaValue("");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("medical-login-container ", className)} {...props}>
      <Card className="medical-login-card p-5">
        <CardHeader>
          <div className="flex flex-col items-center space-y-3 pb-2">
            <div className="medical-icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="medical-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m-2-4h4m3-4c0 2.5-5 2.5-5 2.5s-5 0-5-2.5c0-2.5 5-7.5 5-7.5s5 5 5 7.5zM9 6c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z"
                />
              </svg>
            </div>
            <CardTitle className="medical-title">Giriş Yap</CardTitle>
          </div>
          <CardDescription className="medical-description">
            Profilinize güvenli bir şekilde erişin
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto scrollbar-hide">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      E-posta Adresi
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="medical-input"
                        type="email"
                        placeholder="m@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700">Şifre</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Şifrenizi mi unuttunuz?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="medical-input"
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🔹 Google reCAPTCHA */}
              <div className=" justify-center w-full  mt-5">
                <div className="flex justify-center">
                  {/* {isClient && captchaRefresh && (
                    <ReCAPTCHA
                      sitekey={"6Ld8oXoqAAAAAAsGH8Msz4QdcT5tQ-Kv9ExBSvyv"}
                      onChange={handleCaptchaChange}
                    />
                  )} */}
                </div>

                <span className="text-xs text-red-500 ms-7">{formErrors}</span>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="medical-submit-button"
            disabled={isLoading}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </CardFooter>
        <div className="mt-4 pb-6 text-center text-sm text-gray-600">
          Hesabınız yok mu?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Kayıt Ol
          </Link>
        </div>
      </Card>
    </div>
  );
}
