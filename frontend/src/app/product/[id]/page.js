"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Minus, Plus, ShieldCheck, Truck, RefreshCw, Award, ArrowLeft, Loader2 } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { tagDisplayName } from "@/lib/productTags";

const reviews = [
  {
    name: "Devanshi C.",
    time: "3 days ago",
    text: "Absolutely perfect for wedding functions! Super glossy finish and looked just like salon nails.",
    rating: 5,
    verified: true,
  },
  {
    name: "Simran K.",
    time: "1 month ago",
    text: "Absolutely stunning! The glossy finish looks so classy and elegant.",
    rating: 5,
    verified: true,
  },
  {
    name: "Naina B.",
    time: "1 month ago",
    text: "Perfect for weddings! The elegant glossy look matched my outfit beautifully.",
    rating: 5,
    verified: true,
  },
  {
    name: "Princey S.",
    time: "2 months ago",
    text: "Wore these for a wedding and they looked luxurious and premium.",
    rating: 5,
    verified: true,
  },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState("desc");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl(`/api/products/${id}`));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data);
        setActiveImage(data.images?.[0] || "/hero1.png");
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const images = useMemo(() => product?.images?.length ? product.images : ["/hero1.png"], [product]);
  const isSoldOut = (product?.stock || 0) <= 0;

  const toggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7a5641]">
          <Loader2 className="animate-spin" size={22} />
          <span className="text-sm font-medium">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[#ebe1d7] bg-white p-8 text-center shadow-[0_18px_40px_rgba(115,80,60,0.05)]">
          <h1 className="text-3xl font-semibold text-[#3f2a20]">Product not found</h1>
          <p className="mt-3 text-[#7e6554]">{error || "This product may have been removed."}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl bg-[#f3ece4] px-5 py-2.5 font-medium text-[#5b4032]"
            >
              Go back
            </button>
            <Link href="/shop" className="rounded-xl bg-[#3f2a20] px-5 py-2.5 font-medium text-white">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = product.name;
  const primaryTags = product.tags?.slice(0, 4) || [];

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#333333]">
      <div className="max-w-[1280px] mx-auto px-6 py-4 text-[11px] uppercase tracking-[0.1em] text-gray-400">
        <Link href="/" className="hover:text-[#B39178]">Home</Link> /{" "}
        <Link href="/shop" className="hover:text-[#B39178]">Shop</Link> /{" "}
        <span className="text-gray-600 ml-1">{title}</span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col-reverse md:flex-row gap-5">
          <div className="flex md:flex-col gap-3 min-w-[80px]">
            {images.map((img, i) => (
              <button
                type="button"
                key={`${img}-${i}`}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 md:w-20 md:h-20 border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  activeImage === img ? "border-[#B39178] scale-105" : "border-gray-100 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${title} thumbnail ${i + 1}`} width={100} height={100} className="object-cover w-full h-full" unoptimized />
              </button>
            ))}
          </div>

          <div className="flex-1 relative w-full h-[520px] rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-50 group">
            <Image
              src={activeImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />

            <div className="absolute top-5 left-5">
              <span className="bg-[#B39178] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {isSoldOut ? "Sold Out" : "In Stock"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 self-start text-sm text-[#7e6554] hover:text-[#3f2a20]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={1} />
              ))}
            </div>
            <span className="text-[12px] text-gray-500 font-medium tracking-wide">
              ({reviews.length} Verified Reviews)
            </span>
          </div>

          <h1 className="text-4xl font-bold text-[#333333] leading-[1.1] mb-4">
            {title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {primaryTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f7efe5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8d6f5a]">
                {tagDisplayName(tag)}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 bg-orange-50/50 self-start px-3 py-1.5 rounded-lg border border-orange-100/50">
            <span className="animate-pulse">🔥</span>
            <p className="text-[12px] text-orange-800 font-bold uppercase tracking-wider">
              {product.stock || 0} left in stock
            </p>
          </div>

          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-3xl font-bold text-[#B39178]">
              {currencyFormatter.format(product.price || 0)}
            </span>
          </div>
          <p className="text-[13px] text-gray-500 italic mb-8 border-b border-gray-100 pb-6">
            Tax included. Shipping calculated at checkout.
          </p>

          <div className="mb-8 space-y-3">
            <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-wider">
              <span className="text-gray-600">Inventory Status</span>
              <span className="text-red-500">{isSoldOut ? "Out of stock" : "Ready to ship"}</span>
            </div>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[25%]" />
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Quantity
              </p>
              <div className="flex gap-3 items-center">
                <div className="flex items-center border-2 border-gray-100 rounded-full h-14 px-6 bg-white gap-8">
                  <button
                    type="button"
                    onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-bold w-4 text-center">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button className="flex-1 bg-[#333333] hover:bg-black text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-lg hover:shadow-xl active:scale-95 h-14">
                  Add To Cart
                </button>
                <button className="w-14 h-14 border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all bg-white group shadow-sm">
                  <Heart size={22} className="group-active:fill-red-500" strokeWidth={1.5} />
                </button>
              </div>
              <button className="w-full bg-[#B39178] hover:bg-[#9c7d66] text-white h-14 rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-lg hover:shadow-xl active:scale-95 mb-4 mt-4">
                Buy It Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 py-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <ShieldCheck size={20} className="text-[#B39178]" />
              </div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Handmade & Cured</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <RefreshCw size={20} className="text-[#B39178]" />
              </div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Reusable & Waterproof</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Truck size={18} className="text-[#B39178]" />
              </div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Express Delivery</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Award size={18} className="text-[#B39178]" />
              </div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Premium Raw Materials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-20 space-y-6">
        <div className="border-b border-gray-100 overflow-hidden">
          <button
            onClick={() => toggle("desc")}
            className="w-full flex justify-between items-center py-6 text-[14px] font-bold uppercase tracking-[0.2em] text-[#333333] hover:text-[#B39178] transition-colors"
          >
            <span>Detailed Description</span>
            <div className="bg-gray-50 rounded-full p-2">
              {openSection === "desc" ? <Minus size={16} /> : <Plus size={16} />}
            </div>
          </button>

          <div className={`transition-all duration-500 ease-in-out ${openSection === "desc" ? "max-h-[500px] mb-8" : "max-h-0"}`}>
            <div className="text-[14px] text-gray-500 leading-[1.8] space-y-4 pr-20">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-2 text-[#333] font-medium">
                <li>Multiple tags for smarter search and filtering</li>
                <li>Custom color and style combinations supported</li>
                <li>Reusable press-on set with premium finish</li>
                <li>Made for your nail art ecommerce system</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 overflow-hidden">
          <button
            onClick={() => toggle("shipping")}
            className="w-full flex justify-between items-center py-6 text-[14px] font-bold uppercase tracking-[0.2em] text-[#333333] hover:text-[#B39178] transition-colors"
          >
            <span>Shipping & Returns</span>
            <div className="bg-gray-50 rounded-full p-2">
              {openSection === "shipping" ? <Minus size={16} /> : <Plus size={16} />}
            </div>
          </button>

          <div className={`transition-all duration-500 ease-in-out ${openSection === "shipping" ? "max-h-[500px] mb-8" : "max-h-0"}`}>
            <div className="text-[14px] text-gray-500 leading-[1.8] pr-20">
              <p>We provide express shipping across India. Delivery time depends on location and current order load.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 overflow-hidden">
          <button
            onClick={() => toggle("review")}
            className="w-full flex justify-between items-center py-6 text-[14px] font-bold uppercase tracking-[0.2em] text-[#333333] hover:text-[#B39178] transition-colors"
          >
            <span>Verified Customer Reviews</span>
            <div className="bg-gray-50 rounded-full p-2">
              {openSection === "review" ? <Minus size={16} /> : <Plus size={16} />}
            </div>
          </button>

          <div className={`transition-all duration-500 ease-in-out ${openSection === "review" ? "max-h-[3000px] mb-8 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16 border-b border-gray-100 pb-12">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <span className="text-6xl font-black text-[#333]">5.0</span>
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={18} fill="currentColor" strokeWidth={1} />
                        ))}
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#B39178]">Exceptional Quality</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Based on {reviews.length} verified shoppers
                  </p>
                </div>
                <button className="bg-[#333] hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-10 py-5 rounded-full shadow-lg transition-transform active:scale-95">
                  Write A Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-[#FDFBF7] rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-black text-[#333] tracking-tight">{r.name}</span>
                          {r.verified && (
                            <div className="bg-green-100 text-green-600 rounded-full p-0.5" title="Verified Buyer">
                              <ShieldCheck size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{r.time}</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} size={10} fill={starIdx < r.rating ? "currentColor" : "none"} strokeWidth={1} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">"{r.text}"</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12 pt-8 border-t border-gray-50">
                <button className="text-[11px] font-black uppercase tracking-[0.3em] text-[#B39178] hover:text-[#333] transition-colors underline underline-offset-8">
                  Show more reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
