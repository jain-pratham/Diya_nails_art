"use client";

import Link from "next/link";
import Image from "next/image";
import { Loader2, Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING = 499;

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

export default function CartPage() {
  const {
    items,
    subtotal,
    itemCount,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#2e241d]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-light tracking-tight text-[#201712] sm:text-5xl">
            Your Cart
          </h1>
          <p className="mt-3 text-sm text-[#7a6453] sm:text-base">
            <Link href="/" className="transition-colors hover:text-[#B39178]">
              Home
            </Link>{" "}
            / Your Shopping Cart
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex items-center gap-3 text-[#7a5641]">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-sm font-medium">Loading cart...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <EmptyCart error={error} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <section className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {items.map((item) => {
                const product = item.product;
                const primaryImage = product.images?.[0] || "/ballerina_nails.png";
                const stock = Number(product.stock) || 0;

                return (
                  <article
                    key={product._id}
                    className="rounded-2xl border border-[#eadcca] bg-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/product/${product._id}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f7efe6] sm:h-28 sm:w-28"
                      >
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 640px) 96px, 112px"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/product/${product._id}`}>
                              <h2 className="text-lg font-medium leading-snug text-[#201712] transition-colors hover:text-[#B39178] sm:text-2xl">
                                {product.name}
                              </h2>
                            </Link>
                            <p className="mt-1 text-sm text-[#8a7465]">
                              Stock available: {stock}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product._id)}
                            className="shrink-0 text-[#a08a7a] transition hover:text-[#7d5a45]"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {product.tags?.[0] && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-[#8a7465]">
                            <Tag size={14} className="text-[#B39178]" />
                            <span>{product.tags[0]}</span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xl font-semibold text-[#201712] sm:text-2xl">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex w-full max-w-[150px] items-center justify-between rounded-xl border border-[#e7d6c3] bg-[#fdf8f2] px-2 py-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5f4a3c] transition hover:bg-[#f0e2d4] disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Decrease quantity for ${product.name}`}
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-7 text-center text-base font-medium">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(product._id, item.quantity + 1)}
                              disabled={stock > 0 && item.quantity >= stock}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5f4a3c] transition hover:bg-[#f0e2d4] disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Increase quantity for ${product.name}`}
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <p className="text-left text-xl font-semibold text-[#201712] sm:text-right">
                            {formatPrice(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-[#eadcca] bg-[#fcf7f1] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7d5a45]">
                      Order Summary
                    </h2>
                    <p className="mt-1 text-sm text-[#8a7465]">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7465] underline underline-offset-4 hover:text-[#7d5a45]"
                  >
                    Clear
                  </button>
                </div>

                {remaining > 0 ? (
                  <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#7d5a45]">
                    Add {formatPrice(remaining)} more for free shipping.
                  </p>
                ) : (
                  <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#7d5a45]">
                    Free shipping unlocked for this order.
                  </p>
                )}

                <div className="mt-6 space-y-3 border-t border-[#eadcca] pt-5 text-sm text-[#6f5645]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#201712]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-[#201712]">
                      {remaining === 0 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-base font-semibold text-[#201712]">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 block w-full rounded-xl bg-[#201712] px-5 py-4 text-center text-sm font-medium text-white transition hover:bg-[#B39178]"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="mt-4 block text-center text-sm text-[#7d5a45] underline underline-offset-4 hover:text-[#B39178]"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCart({ error }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[#eadcca] bg-white p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7efe6] text-[#7d5a45]">
        <ShoppingBag size={28} />
      </div>
      <h2 className="mt-5 text-2xl font-medium text-[#201712]">Your cart is empty.</h2>
      <p className="mt-2 text-sm leading-6 text-[#7a6453]">
        Add your favorite press-on nail sets and they will appear here.
      </p>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-full bg-[#2e241d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B39178]"
      >
        Continue shopping
      </Link>
    </div>
  );
}
