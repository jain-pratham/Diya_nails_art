"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";

const FREE_SHIPPING = 499;

const DEMO_ITEMS = [
  {
    id: 1,
    name: "Ballerina Nails",
    price: 149,
    originalPrice: 199,
    badge: "NEW",
    quantity: 1,
    image: "/ballerina_nails.png",
  },
  {
    id: 2,
    name: "Glossy Pink Nails",
    price: 199,
    originalPrice: 249,
    badge: "TRENDING",
    quantity: 1,
    image: "/ballerina_nails.png",
  },
  {
    id: 3,
    name: "French Tip Nails",
    price: 249,
    originalPrice: 299,
    badge: "BESTSELLER",
    quantity: 1,
    image: "/ballerina_nails.png",
  },
];

export default function CartPage() {
  const [items, setItems] = useState(DEMO_ITEMS);
  const [discountCode, setDiscountCode] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#2e241d]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-light tracking-tight text-[#201712] sm:text-5xl">
            Your Cart
          </h1>
          <p className="mt-3 text-sm text-[#7a6453] sm:text-base">
            <Link href="/" className="hover:text-[#B39178] transition-colors">
              Home
            </Link>{" "}
            / Your Shopping Cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <section className="space-y-5">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-[#eadcca] bg-white p-8 text-center">
                <p className="text-lg text-[#2e241d]">Your cart is empty.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex rounded-full bg-[#2e241d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B39178]"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#eadcca] bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f7efe6] sm:h-28 sm:w-28">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-lg font-medium leading-snug text-[#201712] sm:text-2xl">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-sm text-[#8a7465]">Both Hands</p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 text-[#a08a7a] transition hover:text-[#7d5a45]"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm text-[#8a7465]">
                        <Tag size={14} className="text-[#B39178]" />
                        <span>{item.badge}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xl font-semibold text-[#201712] sm:text-2xl">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-sm text-[#aa9381] line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full max-w-[150px] items-center justify-between rounded-xl border border-[#e7d6c3] bg-[#fdf8f2] px-2 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5f4a3c] transition hover:bg-[#f0e2d4]"
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-7 text-center text-base font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5f4a3c] transition hover:bg-[#f0e2d4]"
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <p className="text-left text-xl font-semibold text-[#201712] sm:text-right">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-[#eadcca] bg-[#fcf7f1] p-5 sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7d5a45]">
                Order Summary
              </h2>

              {remaining > 0 && (
                <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#7d5a45]">
                  Add {formatPrice(remaining)} more for free shipping.
                </p>
              )}

              {remaining === 0 && (
                <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#7d5a45]">
                  Free shipping unlocked for this order.
                </p>
              )}

              <div className="mt-5">
                <label className="mb-2 block text-sm text-[#7a6453]">
                  Discount code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(event) => setDiscountCode(event.target.value)}
                    placeholder="Enter code"
                    className="min-w-0 flex-1 rounded-xl border border-[#e7d6c3] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#b89f8c] focus:border-[#B39178]"
                  />
                  <button
                    type="button"
                    className="rounded-xl border border-[#d9c3ad] px-4 py-3 text-sm font-medium text-[#5f4a3c] transition hover:bg-[#f4e5d6]"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-[#eadcca] pt-5 text-sm text-[#6f5645]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#201712]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#201712]">Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-base font-semibold text-[#201712]">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-[#201712] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#B39178]">
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="mt-4 block text-center text-sm text-[#7d5a45] underline underline-offset-4 hover:text-[#B39178]"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
