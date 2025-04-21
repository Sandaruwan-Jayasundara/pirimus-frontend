'use client';
import {SignupForm} from "@/components/form/SignupForm";
import {useAuth} from '@/context/AuthContext';

export default function SignupPage() {
  const {isLoading} = useAuth();

  if (isLoading)
  {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <SignupForm className="w-full"/>
        </div>
      </div>
  );
}