"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResetToken("");
    setError("");

    try {
      const response = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to request reset");
      }

      setMessage(data.message);
      setResetToken(data.resetToken || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-[#2e241d]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#eadcca] bg-white p-8 shadow-sm">
        <Mail className="text-[#B39178]" size={34} />
        <h1 className="mt-5 text-3xl font-light text-[#201712]">Reset password</h1>
        <p className="mt-3 text-sm leading-6 text-[#7a6453]">Enter your account email to generate a reset link.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none focus:border-[#B39178]"
          />
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#201712] px-5 py-3 text-sm font-medium text-white disabled:opacity-70">
            {loading && <Loader2 className="animate-spin" size={16} />}
            Send reset link
          </button>
        </form>

        {message && <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {resetToken && (
          <Link href={`/reset-password?token=${encodeURIComponent(resetToken)}`} className="mt-3 block rounded-xl border border-[#eadcca] p-3 text-sm font-medium text-[#7d5a45] underline underline-offset-4">
            Development reset link
          </Link>
        )}
        {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </main>
  );
}
