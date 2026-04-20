"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, Tag } from "lucide-react";

export default function CartPage() {
  const FREE_SHIPPING = 499;
  const scrollRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load demo data (unique IDs)
  useEffect(() => {
    const demo = [
      { id: 1, name: "Ballerina Nails", price: 149, originalPrice: 199, badge: "NEW", quantity: 1, image: "/ballerina_nails.png" },
      { id: 2, name: "Glossy Pink Nails", price: 199, originalPrice: 249, badge: "TRENDING", quantity: 1, image: "/ballerina_nails.png" },
      { id: 3, name: "French Tip Nails", price: 249, originalPrice: 299, badge: "BESTSELLER", quantity: 1, image: "/ballerina_nails.png" },
      { id: 4, name: "Nude Nails", price: 179, originalPrice: 229, badge: "HOT", quantity: 1, image: "/ballerina_nails.png" },
      { id: 5, name: "Luxury Nails", price: 299, originalPrice: 399, badge: "PREMIUM", quantity: 1, image: "/ballerina_nails.png" },
      { id: 6, name: "Matte Black Nails", price: 189, originalPrice: 239, badge: "CLASSIC", quantity: 1, image: "/ballerina_nails.png" },
    ];
    setItems(demo);
  }, []);

  // ✅ Price format
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  // ✅ Update qty
  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // ✅ Remove item
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Totals
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  

  const remaining = FREE_SHIPPING - subtotal;

  return (
    <div className="h-screen bg-white text-[#333] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 py-10 h-full flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light">
            Your Cart ({items.length})
          </h1>
          <Link href="/shop" className="text-sm underline hover:text-[#B39178]">
            Continue shopping
          </Link>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-12 gap-12 flex-1 overflow-hidden">

          {/* LEFT - SCROLL AREA */}
          <div className="col-span-8 h-full overflow-hidden">
            <div className="h-full overflow-y-auto pr-4 custom-scroll">

              <div className="space-y-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-6"
                  >
                    {/* PRODUCT */}
                    <div className="flex gap-5">
                      <div className="relative w-24 h-24 bg-gray-100 rounded">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium uppercase">
                          {item.name}
                        </h3>

                        <div className="text-sm mt-2">
                          <span className="line-through text-gray-400 mr-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                          <span className="font-semibold">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        <p className="text-xs mt-1 flex items-center gap-1">
                          <Tag size={12} /> {item.badge}
                        </p>
                      </div>
                    </div>

                    {/* QUANTITY */}
                    <div className="flex flex-col items-center">
                      <div className="flex border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={12} />
                        </button>

                        <span className="px-4 flex items-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-3 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* TOTAL */}
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT - FIXED SUMMARY */}
          <div className="col-span-4 h-full">
            <div className="p-8 border bg-[#FBFAFA] rounded-lg">

              <h2 className="text-xs uppercase font-bold mb-6">
                Order Summary
              </h2>

              {remaining > 0 && (
                <p className="text-sm text-[#B39178] mb-4">
                  Add {formatPrice(remaining)} more for FREE SHIPPING 🚚
                </p>
              )}

              <input
                type="text"
                placeholder="Discount code"
                className="w-full border px-4 py-3 mb-6 text-sm rounded"
              />

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between mb-6 text-sm text-gray-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <button className="w-full bg-black text-white py-4 uppercase text-xs tracking-widest hover:opacity-90">
                Checkout
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ✅ HIDE SCROLLBAR */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          display: none;
        }
        .custom-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}