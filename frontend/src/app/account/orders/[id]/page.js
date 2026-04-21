"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${user?.token || ""}`,
    }),
    [user?.token]
  );

  useEffect(() => {
    if (!user?.token || !id) return;

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl(`/api/orders/${id}`), { headers });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load order");
        }

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [headers, id, user?.token]);

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-10 text-[#2e241d]">
      <div className="mx-auto max-w-5xl">
        <Link href="/account?tab=orders" className="inline-flex items-center gap-2 text-sm text-[#7d5a45] underline underline-offset-4">
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        {loading ? (
          <div className="mt-8 flex justify-center rounded-2xl border border-[#eadcca] bg-white p-12">
            <Loader2 className="animate-spin text-[#B39178]" size={34} />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>
        ) : order ? (
          <div className="mt-8 space-y-6">
            <section className="rounded-2xl border border-[#eadcca] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#B39178]">{order.orderNumber}</p>
              <h1 className="mt-2 text-3xl font-light text-[#201712]">Order details</h1>
              <p className="mt-2 text-sm text-[#7a6453]">Placed on {formatDate(order.createdAt)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">{order.orderStatus}</span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700">Payment {order.paymentStatus}</span>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="rounded-2xl border border-[#eadcca] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#201712]">Items</h2>
                <div className="mt-5 space-y-4">
                  {order.items.map((item) => (
                    <div key={`${order._id}-${item.product}`} className="flex gap-4 rounded-xl bg-[#fcf7f1] p-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                        {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <Package className="m-5 text-[#B39178]" size={24} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#201712]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#7a6453]">Qty {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#201712]">{formatPrice(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <section className="rounded-2xl border border-[#eadcca] bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#201712]">Summary</h2>
                  <div className="mt-4 space-y-3 text-sm text-[#6f5645]">
                    <Row label="Subtotal" value={formatPrice(order.subtotal)} />
                    <Row label="Discount" value={`-${formatPrice(order.discount)}`} />
                    <Row label="Shipping" value={order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)} />
                    <Row label="Tax" value={formatPrice(order.tax)} />
                    <Row label="Total" value={formatPrice(order.total)} strong />
                  </div>
                </section>

                <section className="rounded-2xl border border-[#eadcca] bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#201712]">Shipping</h2>
                  <p className="mt-4 text-sm leading-6 text-[#7a6453]">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </section>
              </aside>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "border-t border-[#eadcca] pt-3 text-base font-semibold text-[#201712]" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
