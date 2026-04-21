import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function PaymentFailurePage({ searchParams }) {
  const params = await searchParams;
  const reason = params?.reason || "Your payment could not be completed.";

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-[#2e241d]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <XCircle className="mx-auto text-red-500" size={54} />
        <h1 className="mt-5 text-3xl font-light text-[#201712]">Payment failed</h1>
        <p className="mt-3 text-sm leading-6 text-[#7a6453]">{reason}</p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/checkout" className="rounded-full bg-[#201712] px-6 py-3 text-sm font-medium text-white">
            Try again
          </Link>
          <Link href="/cart" className="rounded-full border border-[#d9c3ad] px-6 py-3 text-sm font-medium text-[#5f4a3c]">
            Back to cart
          </Link>
        </div>
      </div>
    </main>
  );
}
