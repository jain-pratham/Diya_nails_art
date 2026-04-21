"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, FolderTree, IndianRupee, Loader2, Package, ShoppingBag, Users } from "lucide-react";
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
  }).format(new Date(date));

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${user?.token || ""}`,
    }),
    [user?.token]
  );

  useEffect(() => {
    if (!user?.token) return;

    const loadStats = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl("/api/admin/stats"), { headers });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load dashboard");
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [headers, user?.token]);

  const cards = [
    { label: "Revenue", value: formatPrice(stats?.revenue), icon: IndianRupee, color: "bg-emerald-50 text-emerald-700" },
    { label: "Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Products", value: stats?.productCount || 0, icon: Package, color: "bg-pink-50 text-pink-700" },
    { label: "Customers", value: stats?.customerCount || 0, icon: Users, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Track orders, revenue, customers, and catalog health.</p>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-gray-100 bg-white p-10">
          <Loader2 className="animate-spin text-[#AF8F75]" size={32} />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent orders</h2>
                  <p className="mt-1 text-sm text-gray-500">Latest customer activity.</p>
                </div>
                <Link href="/admin/orders" className="text-sm font-medium text-[#AF8F75] hover:underline">
                  Manage
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {(stats?.recentOrders || []).length === 0 ? (
                  <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No orders yet.</p>
                ) : (
                  stats.recentOrders.map((order) => (
                    <div key={order._id} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-[#AF8F75]">{order.orderNumber}</p>
                          <p className="mt-1 text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
                            {order.orderStatus} / {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <QuickLink icon={Package} href="/admin/products" title="Products" text="Add, edit, or remove inventory." />
              <QuickLink icon={FolderTree} href="/admin/categories" title="Categories" text="Create and edit product categories." />
              <QuickLink icon={Activity} href="/admin/orders" title="Orders" text="Update order and payment statuses." />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickLink({ icon: Icon, href, title, text }) {
  return (
    <Link href={href} className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7efe5] text-[#7a5641]">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-gray-500">{text}</p>
        </div>
      </div>
    </Link>
  );
}
