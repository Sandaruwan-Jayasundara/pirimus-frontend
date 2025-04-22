"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import Link from "next/link";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {toast} from "sonner"; // Import sonner toast
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Zod schema for OTP
const OtpFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

// Zod schema for new password
const PasswordFormSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export function ForgotPasswordForm({
                                     className,
                                     ...props
                                   }: React.ComponentPropsWithoutRef<"div">)
{
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  // Form for OTP
  const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Form for new password
  const passwordForm = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try
    {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
      });

      if (!response.ok)
      {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP. Please try again.");
      }

      setSuccess("OTP sent to your email. Please check your inbox.");
      setStep(2); // Move to OTP verification step
    } catch (err)
    {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally
    {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data: z.infer<typeof OtpFormSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try
    {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, otp: data.pin, newPassword: ""}), // Send empty newPassword to just verify OTP
      });

      if (!response.ok)
      {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid OTP. Please try again.");
      }

      setSuccess("OTP verified successfully. Please enter your new password.");
      setStep(3); // Move to password reset step
      toast.success("OTP Verified", {
        description: "Please enter your new password.",
      });
    } catch (err)
    {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("OTP Verification Failed", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally
    {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data: z.infer<typeof PasswordFormSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try
    {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpForm.getValues("pin"), // Use the verified OTP
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok)
      {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to reset password. Please try again.");
      }

      setSuccess("Password reset successfully. You can now log in with your new password.");
      setEmail("");
      otpForm.reset();
      passwordForm.reset();
      setStep(1); // Reset to initial step
      toast.success("Password Reset Successful", {
        description: "You can now log in with your new password.",
      });
    } catch (err)
    {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Password Reset Failed", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally
    {
      setIsLoading(false);
    }
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              {step === 1
                  ? "Enter your email to receive a password reset OTP"
                  : step === 2
                      ? "Enter the OTP sent to your email"
                      : "Enter your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
                <form onSubmit={handleSendOtp}>
                  <div className="flex flex-col gap-6">
                    {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert>
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Remembered your password?{" "}
                    <Link href="/login" className="underline underline-offset-4">
                      Log in
                    </Link>
                  </div>
                </form>
            )}

            {step === 2 && (
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert>
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    <FormField
                        control={otpForm.control}
                        name="pin"
                        render={({field}) => (
                            <FormItem>
                              <FormLabel>One-Time Password</FormLabel>
                              <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                    <InputOTPSlot index={4}/>
                                    <InputOTPSlot index={5}/>
                                  </InputOTPGroup>
                                </InputOTP>
                              </FormControl>
                              <FormDescription>
                                Please enter the one-time password sent to your email.
                              </FormDescription>
                              <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying OTP..." : "Verify OTP"}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      Didn’t receive an OTP?{" "}
                      <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="underline underline-offset-4 hover:text-primary"
                          disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                </Form>
            )}

            {step === 3 && (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert>
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({field}) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter your new password"
                                    {...field}
                                    disabled={isLoading}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a new password (at least 8 characters).
                              </FormDescription>
                              <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      Back to{" "}
                      <Link href="/login" className="underline underline-offset-4">
                        Log in
                      </Link>
                    </div>
                  </form>
                </Form>
            )}
          </CardContent>
        </Card>
      </div>
  );
}