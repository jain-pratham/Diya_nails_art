"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const ORDER_STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

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

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${user?.token || ""}`,
    }),
    [user?.token]
  );

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/admin/orders"), {
        headers: authHeaders,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load orders");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (user?.token) loadOrders();
  }, [loadOrders, user?.token]);

  const updateOrder = async (orderId, payload) => {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/admin/orders/${orderId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update order");
      }

      setOrders((current) => current.map((order) => (order._id === data._id ? data : order)));
      toast.success("Order updated successfully");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Unable to update order");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Order Management</h1>
          <p className="mt-1 text-sm text-gray-500">Review orders and update fulfillment or payment status.</p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3f2a20] px-5 py-3 text-sm font-medium text-white"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-[#AF8F75]" size={32} />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <ShoppingBag className="mx-auto mb-3 text-gray-300" size={40} />
            No orders found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <article key={order._id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#AF8F75]">{order.orderNumber}</p>
                    <h2 className="mt-2 text-lg font-semibold text-gray-900">{formatPrice(order.total)}</h2>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      {order.user?.name || "Customer"} · {order.user?.email || "No email"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:w-[460px]">
                    <StatusSelect
                      label="Order status"
                      value={order.orderStatus}
                      options={ORDER_STATUSES}
                      disabled={updatingId === order._id}
                      onChange={(value) => updateOrder(order._id, { orderStatus: value })}
                    />
                    <StatusSelect
                      label="Payment status"
                      value={order.paymentStatus}
                      options={PAYMENT_STATUSES}
                      disabled={updatingId === order._id}
                      onChange={(value) => updateOrder(order._id, { paymentStatus: value })}
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 rounded-2xl bg-gray-50 p-4 text-sm lg:grid-cols-[1fr_280px]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Items</p>
                    <div className="mt-3 space-y-2">
                      {order.items.map((item) => (
                        <div key={`${order._id}-${item.product}`} className="flex justify-between gap-3">
                          <span className="line-clamp-1 text-gray-700">{item.name} × {item.quantity}</span>
                          <span className="font-medium text-gray-900">{formatPrice(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ship to</p>
                    <p className="mt-3 leading-6 text-gray-600">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                {updatingId === order._id && (
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#7a5641]">
                    <Loader2 className="animate-spin" size={14} />
                    Updating order...
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusSelect({ label, value, options, disabled, onChange }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-800 outline-none focus:border-[#AF8F75]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
