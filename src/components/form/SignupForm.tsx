"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { AuthService } from "@/lib/AuthService";
import { User } from "@/type/user";
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
import { formatPhoneNumber } from "@/lib/phoneUtils";

// Zod schema for signup form
const SignupFormSchema = z.object({
  firstName: z.string().min(1, { message: "Ad gereklidir" }),
  lastName: z.string().min(1, { message: "Soyad gereklidir" }),
  phoneNumber: z.string().regex(/^0 \(\d{3}\) \d{3} \d{2} \d{2}$/, {
    message: "Geçersiz telefon numarası formatı",
  }),
  seniority: z.string().min(1, { message: "Kıdem seviyesi gereklidir" }),
  email: z.string().email({ message: "Geçersiz e-posta adresi" }),
  password: z
    .string()
    .min(8, { message: "Şifre en az 8 karakter olmalıdır" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[a-zA-Z\d\W]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character - Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir",
      }
    ),
});

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      seniority: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof SignupFormSchema>) => {
    setIsLoading(true);
    try {
      const userData: User = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: parseInt(data.phoneNumber.replace(/\D/g, ""), 10),
        seniority: data.seniority,
      };
      const response = await AuthService.signup(userData);
      if (response) {
        toast.success("Kayıt Başarılı", {
          description: "Hesabınız oluşturuldu. Lütfen giriş yapın.",
        });        
        router.push("/login");
      }
    } catch (err) {
      toast.error("Kayıt Başarısız", {
        description:
          err instanceof Error
            ? err.message
            : "Kayıt sırasında bir hata oluştu.",
      });      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("medical-login-container", className)} {...props}>
      <Card className="medical-login-card">
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
            <CardTitle className="medical-title">Kayıt Ol</CardTitle>
          </div>
          <CardDescription className="medical-description">
            Hesabınızı oluşturun
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Ad</FormLabel>
                    <FormControl>
                      <Input
                        className="medical-input"
                        type="text"
                        placeholder="John"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Soyad</FormLabel>
                    <FormControl>
                      <Input
                        className="medical-input"
                        type="text"
                        placeholder="Doe"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Telefon Numarası</FormLabel>
                    <FormControl>
                      <Input
                        className="medical-input"
                        type="tel"
                        placeholder="0 (555) 123 45 67"
                        maxLength={17}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatPhoneNumber(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Commission Rate</FormLabel>
                          <FormControl>
                            <Input
                                className="medical-input"
                                type="text"
                                placeholder="10.5"
                                disabled={isLoading}
                                {...field}
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                /> */}
              <FormField
                control={form.control}
                name="seniority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Kıdem Seviyesi</FormLabel>
                    <FormControl>
                      <Input
                        className="medical-input"
                        type="text"
                        placeholder="Senior"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">E-posta Adresi</FormLabel>
                    <FormControl>
                      <Input
                        className="medical-input"
                        type="email"
                        placeholder="john.doe@example.com"
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
                    <FormLabel className="text-gray-700">Şifre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="medical-input"
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
            {isLoading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
          </Button>
        </CardFooter>
        <div className="mt-4 pb-6 text-center text-sm text-gray-600">
          Zaten bir hesabınız var mı?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Giriş Yap
          </Link>
        </div>
      </Card>
    </div>
  );
}
