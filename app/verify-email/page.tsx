"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token"); // token from email link
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("Invalid verification link.");
      return;
    }

    const verifyAndLogin = async () => {
      try {
        // Call verify API
        const res = await axios.post("/api/verify-email", { token });

        if (res.data.success) {
          setStatus("Email verified! Logging you in...");

          // Auto-login via NextAuth CredentialsProvider
          await signIn("credentials", {
            redirect: false,
            identifier: res.data.user.email,
            password: res.data.tempPassword,
          });

          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          setStatus(res.data.message || "Verification failed.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Verification failed. Try again.");
      }
    };

    verifyAndLogin();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold text-center">{status}</h1>
    </div>
  );
}
