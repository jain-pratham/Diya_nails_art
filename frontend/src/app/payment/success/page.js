import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderNumber = params?.orderNumber || "";
  const paymentId = params?.paymentId || "";

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-[#2e241d]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#dbeed8] bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-green-600" size={54} />
        <h1 className="mt-5 text-3xl font-light text-[#201712]">Payment successful</h1>
        <p className="mt-3 text-sm leading-6 text-[#7a6453]">
          Your payment was verified and the order has been confirmed.
        </p>

        {orderNumber && (
          <p className="mt-5 text-sm text-[#7a6453]">
            Order number: <span className="font-semibold text-[#201712]">{orderNumber}</span>
          </p>
        )}
        {paymentId && (
          <p className="mt-2 text-xs text-[#9a8474]">
            Payment ID: <span className="font-medium">{paymentId}</span>
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/account?tab=orders" className="rounded-full bg-[#201712] px-6 py-3 text-sm font-medium text-white">
            View orders
          </Link>
          <Link href="/shop" className="rounded-full border border-[#d9c3ad] px-6 py-3 text-sm font-medium text-[#5f4a3c]">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
