"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reset password");
      }

      setMessage(data.message);
      toast.success(data.message || "Password reset successfully");
      setPassword("");
    } catch (err) {
      toast.error(err.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-[#2e241d]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#eadcca] bg-white p-8 shadow-sm">
        <Lock className="text-[#B39178]" size={34} />
        <h1 className="mt-5 text-3xl font-light text-[#201712]">Create new password</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Reset token"
            className="w-full rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none focus:border-[#B39178]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            className="w-full rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none focus:border-[#B39178]"
          />
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#201712] px-5 py-3 text-sm font-medium text-white disabled:opacity-70">
            {loading && <Loader2 className="animate-spin" size={16} />}
            Reset password
          </button>
        </form>

        {message && (
          <div className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {message} <Link href="/" className="font-semibold underline">Login now</Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
