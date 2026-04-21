"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { apiUrl } from "@/lib/api";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(apiUrl("/api/auth/verify-email"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to verify email");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-[#2e241d]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#eadcca] bg-white p-8 shadow-sm">
        <MailCheck className="text-[#B39178]" size={36} />
        <h1 className="mt-5 text-3xl font-light text-[#201712]">Verify email</h1>
        <p className="mt-3 text-sm leading-6 text-[#7a6453]">Paste your verification token to confirm your email.</p>

        <form onSubmit={verify} className="mt-6 space-y-4">
          <input
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Verification token"
            className="w-full rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none focus:border-[#B39178]"
          />
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#201712] px-5 py-3 text-sm font-medium text-white disabled:opacity-70">
            {loading && <Loader2 className="animate-spin" size={16} />}
            Verify email
          </button>
        </form>

        {message && (
          <p className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 size={16} />
            {message}
          </p>
        )}
        {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
