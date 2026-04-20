"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MapPin, ShoppingBag, Ticket } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, itemCount, loading: cartLoading, refreshCart } = useCart();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addressMode, setAddressMode] = useState("saved");
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [couponCode, setCouponCode] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const savedAddresses = useMemo(() => user?.addresses || [], [user?.addresses]);
  const selectedAddress = addressMode === "saved" ? savedAddresses[selectedAddressIndex] : newAddress;
  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${user?.token || ""}`,
    }),
    [user?.token]
  );

  useEffect(() => {
    if (!user?.token) return;

    const loadPreview = async () => {
      setPreviewLoading(true);
      setError("");

      try {
        const url = new URL(apiUrl("/api/orders/preview"));
        if (couponCode.trim()) {
          url.searchParams.set("couponCode", couponCode.trim());
        }

        const response = await fetch(url.toString(), {
          headers: authHeaders,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load checkout summary");
        }

        setPreview(data);
      } catch (err) {
        setPreview(null);
        setError(err.message);
      } finally {
        setPreviewLoading(false);
      }
    };

    loadPreview();
  }, [authHeaders, couponCode, user?.token]);

  useEffect(() => {
    if (savedAddresses.length === 0) {
      setAddressMode("new");
    }
  }, [savedAddresses.length]);

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!user?.token) {
      setError("Please login before placing your order.");
      return;
    }

    if (!selectedAddress?.fullName || !selectedAddress?.addressLine1 || !selectedAddress?.city || !selectedAddress?.state || !selectedAddress?.zipCode) {
      setError("Please select or enter a complete shipping address.");
      return;
    }

    setPlacing(true);

    try {
      const response = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          shippingAddress: selectedAddress,
          couponCode,
          paymentMethod: "cod",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to place order");
      }

      setPlacedOrder(data);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-center text-[#2e241d]">
        <div className="mx-auto max-w-lg rounded-3xl border border-[#eadcca] bg-white p-8 shadow-sm">
          <ShoppingBag className="mx-auto text-[#B39178]" size={42} />
          <h1 className="mt-5 text-3xl font-light">Login required</h1>
          <p className="mt-3 text-sm leading-6 text-[#7a6453]">
            Please login or create an account before checkout. Your guest cart will merge after login.
          </p>
          <Link href="/cart" className="mt-6 inline-flex rounded-full bg-[#201712] px-6 py-3 text-sm font-medium text-white">
            Back to cart
          </Link>
        </div>
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-[#2e241d]">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#dbeed8] bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto text-green-600" size={52} />
          <h1 className="mt-5 text-3xl font-light">Order placed successfully</h1>
          <p className="mt-3 text-sm text-[#7a6453]">
            Order number: <span className="font-semibold text-[#201712]">{placedOrder.orderNumber}</span>
          </p>
          <p className="mt-2 text-sm text-[#7a6453]">
            Total paid on delivery: {formatPrice(placedOrder.total)}
          </p>
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

  if (!cartLoading && itemCount === 0) {
    return (
      <main className="min-h-screen bg-[#fffdfa] px-4 py-16 text-center text-[#2e241d]">
        <div className="mx-auto max-w-lg rounded-3xl border border-[#eadcca] bg-white p-8 shadow-sm">
          <ShoppingBag className="mx-auto text-[#B39178]" size={42} />
          <h1 className="mt-5 text-3xl font-light">Your cart is empty</h1>
          <p className="mt-3 text-sm text-[#7a6453]">Add products before checkout.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[#201712] px-6 py-3 text-sm font-medium text-white">
            Go to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#2e241d]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:px-8 lg:py-12">
        <section className="space-y-6">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-[#7d5a45] underline underline-offset-4"
            >
              Back
            </button>
            <h1 className="mt-4 text-4xl font-light tracking-tight text-[#201712] sm:text-5xl">
              Checkout
            </h1>
            <p className="mt-3 text-sm text-[#7a6453]">
              Review delivery details and place your order.
            </p>
          </div>

          <div className="rounded-3xl border border-[#eadcca] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#B39178]" />
              <h2 className="text-lg font-semibold text-[#201712]">Shipping address</h2>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mt-5 space-y-3">
                {savedAddresses.map((address, index) => (
                  <label
                    key={`${address.addressLine1}-${index}`}
                    className={`block cursor-pointer rounded-2xl border p-4 transition ${
                      addressMode === "saved" && selectedAddressIndex === index
                        ? "border-[#B39178] bg-[#fbf5ef]"
                        : "border-[#eadcca] bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      className="sr-only"
                      checked={addressMode === "saved" && selectedAddressIndex === index}
                      onChange={() => {
                        setAddressMode("saved");
                        setSelectedAddressIndex(index);
                      }}
                    />
                    <span className="text-sm font-semibold text-[#201712]">{address.label || "Address"}</span>
                    <p className="mt-2 text-sm leading-6 text-[#7a6453]">
                      {address.fullName}<br />
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ""}<br />
                      {address.city}, {address.state} {address.zipCode}<br />
                      {address.country || "India"}
                    </p>
                  </label>
                ))}
              </div>
            )}

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-[#eadcca] p-4">
              <input
                type="radio"
                checked={addressMode === "new"}
                onChange={() => setAddressMode("new")}
              />
              <span className="text-sm font-medium text-[#201712]">Use a new address</span>
            </label>

            {addressMode === "new" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <AddressInput name="fullName" label="Full name" value={newAddress.fullName} onChange={handleAddressChange} required />
                <AddressInput name="phone" label="Phone" value={newAddress.phone} onChange={handleAddressChange} />
                <AddressInput name="addressLine1" label="Address line 1" value={newAddress.addressLine1} onChange={handleAddressChange} required className="sm:col-span-2" />
                <AddressInput name="addressLine2" label="Address line 2" value={newAddress.addressLine2} onChange={handleAddressChange} className="sm:col-span-2" />
                <AddressInput name="city" label="City" value={newAddress.city} onChange={handleAddressChange} required />
                <AddressInput name="state" label="State" value={newAddress.state} onChange={handleAddressChange} required />
                <AddressInput name="zipCode" label="Zip code" value={newAddress.zipCode} onChange={handleAddressChange} required />
                <AddressInput name="country" label="Country" value={newAddress.country} onChange={handleAddressChange} required />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#eadcca] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#201712]">Payment</h2>
            <div className="mt-4 rounded-2xl border border-[#eadcca] bg-[#fbf5ef] p-4">
              <p className="text-sm font-semibold text-[#201712]">Cash on Delivery</p>
              <p className="mt-1 text-sm leading-6 text-[#7a6453]">
                Payment gateway can be added later. For now, orders are saved as COD with pending payment status.
              </p>
            </div>
          </div>
        </section>

        <aside className="mt-8 lg:sticky lg:top-6 lg:mt-0 lg:self-start">
          <div className="rounded-3xl border border-[#eadcca] bg-[#fcf7f1] p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7d5a45]">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={item.product.images?.[0] || "/ballerina_nails.png"}
                      alt={item.product.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-[#201712]">{item.product.name}</p>
                    <p className="mt-1 text-xs text-[#7a6453]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#201712]">{formatPrice(item.lineTotal)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#7a6453]">
                <Ticket size={15} />
                Coupon code
              </label>
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="WELCOME15"
                className="w-full rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#b89f8c] focus:border-[#B39178]"
              />
            </div>

            <div className="mt-6 space-y-3 border-t border-[#eadcca] pt-5 text-sm text-[#6f5645]">
              {previewLoading ? (
                <div className="flex items-center gap-2 text-[#7a5641]">
                  <Loader2 className="animate-spin" size={16} />
                  Calculating total...
                </div>
              ) : (
                <>
                  <SummaryRow label="Subtotal" value={formatPrice(preview?.subtotal)} />
                  <SummaryRow label="Discount" value={`-${formatPrice(preview?.discount)}`} />
                  <SummaryRow label="Shipping" value={preview?.shippingFee === 0 ? "Free" : formatPrice(preview?.shippingFee)} />
                  <SummaryRow label="Tax" value={formatPrice(preview?.tax)} />
                  <div className="flex items-center justify-between pt-2 text-base font-semibold text-[#201712]">
                    <span>Total</span>
                    <span>{formatPrice(preview?.total)}</span>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placing || previewLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#201712] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#B39178] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placing && <Loader2 className="animate-spin" size={16} />}
              {placing ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function AddressInput({ label, className = "", ...props }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7465]">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#b89f8c] focus:border-[#B39178]"
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-medium text-[#201712]">{value}</span>
    </div>
  );
}
