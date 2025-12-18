"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // ✅ read 'token' from URL
  const router = useRouter();
  const { toast } = useToast();

  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("Invalid verification link.");
      return;
    }

    async function verifyEmail() {
      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }), // backend expects 'token'
        });

        const data = await res.json();

        if (data.success) {
          setStatus("Email verified successfully!");
          toast({
            title: "Success",
            description: "Your email has been verified!",
          });

          // Redirect after 2 seconds to sign-in
          setTimeout(() => router.replace("/signin"), 2000);
        } else {
          setStatus(data.message || "Verification failed.");
          toast({
            title: "Verification Failed",
            description: data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("Server error during verification.");
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    }

    verifyEmail();
  }, [token, router, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[90%] max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-md shadow-2xl border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Email Verification
        </h1>

        <p className="text-center text-gray-300 mt-6 text-lg">{status}</p>
      </motion.div>
    </div>
  );
}
