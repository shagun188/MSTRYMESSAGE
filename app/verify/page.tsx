"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("Invalid verification link");
      return;
    }

    // IMPORTANT: send 'token' not 'code'
    fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: code }), // 👈 FIXED!
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("Email verified successfully!");
        } else {
          setStatus(data.message || "Verification failed");
        }
      })
      .catch(() => setStatus("Server error"));
  }, []);

  return (
    <div style={{ padding: "40px", fontSize: "20px" }}>
      {status}
    </div>
  );
}
