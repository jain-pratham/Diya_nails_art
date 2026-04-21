"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  Heart,
  Image as ImageIcon,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import { normalizeTag, tagDisplayName } from "@/lib/productTags";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ProductActions({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useAuth();
  const wishlisted = wishlist.some((item) => (item._id || item) === product._id);
  const [adding, setAdding] = useState(false);
  const isSoldOut = Number(product.stock || 0) <= 0;

  const handleAdd = async () => {
    if (isSoldOut || adding) return;

    setAdding(true);
    try {
      await addToCart(product, 1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col gap-3">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleWishlist(product._id).catch((error) => alert(error.message));
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2e221d] shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-[#f7efe5] hover:text-[#d92972]"
        aria-label="Add to wishlist"
        title="Favorite"
      >
        <Heart size={18} className={wishlisted ? "fill-[#d92972] text-[#d92972]" : ""} />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onQuickView(product);
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2e221d] shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-[#f7efe5] hover:text-[#7a5641]"
        aria-label="Quick view"
        title="Quick view"
      >
        <Eye size={18} />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleAdd();
        }}
        disabled={isSoldOut || adding}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2e221d] shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-[#f7efe5] hover:text-[#7a5641] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Add to cart"
        title="Add to cart"
      >
        {adding ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
      </button>
    </div>
  );
}

function ProductCard({ product, onQuickView }) {
  const primaryImage = product.images?.[0];
  const isSoldOut = Number(product.stock || 0) <= 0;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#eadfce] bg-white shadow-[0_18px_40px_rgba(115,80,60,0.06)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f6eee4]">
        <Link href={`/product/${product._id}`} className="block h-full w-full">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#b59a86]">
              <ImageIcon size={42} />
            </div>
          )}
        </Link>

        {isSoldOut ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#2e221d] px-3 py-1 text-xs font-semibold text-white">
            Sold Out
          </span>
        ) : (
          <span className="absolute left-4 top-4 rounded-full bg-[#d92972] px-3 py-1 text-xs font-semibold text-white">
            In Stock
          </span>
        )}

        <ProductActions product={product} onQuickView={onQuickView} />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <Link href={`/product/${product._id}`}>
            <h3 className="line-clamp-1 text-[17px] font-medium text-[#3f2a20] transition-colors hover:text-[#B39178]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7e6554]">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f7efe5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8d6f5a]"
            >
              {tagDisplayName(tag)}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-sm text-[#8f7767]">In stock: {product.stock}</p>
            <p className="text-lg font-semibold text-[#3f2a20]">{currencyFormatter.format(product.price || 0)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function CollectionProductCard({ product, onQuickView }) {
  const primaryImage = product.images?.[0];
  const hasSalePrice = Number(product.originalPrice) > Number(product.price);

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[18px] bg-[#f6eee4] shadow-[0_12px_28px_rgba(115,80,60,0.08)]">
        <Link href={`/product/${product._id}`} className="relative block aspect-[4/5] overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#b59a86]">
              <ImageIcon size={40} />
            </div>
          )}
        </Link>

        {hasSalePrice && (
          <span className="absolute left-4 top-4 rounded-full bg-[#e73379] px-3 py-1 text-xs font-semibold text-white">
            -
            {Math.round(
              ((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100
            )}
            %
          </span>
        )}

        <ProductActions product={product} onQuickView={onQuickView} />
      </div>

      <div className="px-1 pt-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="line-clamp-2 text-[15px] leading-6 text-[#2e221d] transition-colors hover:text-[#B39178]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-[#e73379]">{currencyFormatter.format(product.price || 0)}</span>
          {product.originalPrice && (
            <span className="text-[14px] text-[#8f7767] line-through">
              {currencyFormatter.format(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function QuickViewModal({ product, onClose }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const images = product.images?.length ? product.images : ["/ballerina_nails.png"];
  const isSoldOut = Number(product.stock || 0) <= 0;

  const handleAdd = async ({ goToCart = false } = {}) => {
    if (isSoldOut || adding) return;

    setAdding(true);
    setMessage("");
    try {
      await addToCart(product, quantity);
      setMessage("Added to cart");
      if (goToCart) {
        onClose();
        router.push("/cart");
      }
    } catch (error) {
      setMessage(error.message || "Unable to add item");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    setQuantity(1);
    setActiveImage(product.images?.[0] || "/ballerina_nails.png");
    setMessage("");
  }, [product]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div className="relative grid max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[28px] bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#3f2a20] shadow-lg transition hover:bg-[#f7efe5]"
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        <div className="bg-[#f6eee4] p-4 sm:p-6">
          <div className="relative aspect-square overflow-hidden rounded-[24px] bg-white">
            <img src={activeImage || images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                    activeImage === image ? "border-[#d92972]" : "border-white"
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <span className="mb-5 w-max rounded-full bg-[#d92972] px-4 py-1 text-sm font-semibold text-white">
            {isSoldOut ? "Sold Out" : "In Stock"}
          </span>

          <h2 className="text-3xl font-light leading-tight text-[#111111] sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#7e6554]">
            {product.description}
          </p>

          <div className="mt-6 text-3xl font-light text-[#d92972]">
            {currencyFormatter.format(product.price || 0)}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags?.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-[#f7efe5] px-3 py-1 text-xs font-medium text-[#7a5641]">
                {tagDisplayName(tag)}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm text-[#7e6554]">
            Stock available: <span className="font-semibold text-[#3f2a20]">{product.stock || 0}</span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-14 items-center justify-between rounded-full border border-[#eadfce] bg-[#f8f4ef] px-5 sm:w-44">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="text-[#3f2a20]"
                aria-label="Decrease quantity"
              >
                <Minus size={17} />
              </button>
              <span className="font-medium text-[#3f2a20]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))}
                className="text-[#3f2a20]"
                aria-label="Increase quantity"
              >
                <Plus size={17} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAdd()}
              disabled={isSoldOut || adding}
              className="h-14 flex-1 rounded-full bg-black px-8 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#3f2a20] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? "Adding..." : isSoldOut ? "Sold Out" : "Add To Cart"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleAdd({ goToCart: true })}
            disabled={isSoldOut || adding}
            className="mt-4 h-14 rounded-full bg-[#d92972] px-8 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#bc1f61] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Buy It Now
          </button>

          {message && <p className="mt-4 text-sm font-medium text-[#7a5641]">{message}</p>}

          <Link
            href={`/product/${product._id}`}
            onClick={onClose}
            className="mt-5 text-sm font-semibold text-[#7a5641] underline underline-offset-4 hover:text-[#3f2a20]"
          >
            View full product details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ initialTag, onCountChange, variant = "shop" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "latest";
  const tagsFromUrl = searchParams.get("tags") || "";
  const view = searchParams.get("view") || "grid";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const mergedTags = new Set();

        if (initialTag) {
          mergedTags.add(normalizeTag(initialTag));
        }

        tagsFromUrl
          .split(",")
          .map((tag) => normalizeTag(tag))
          .filter(Boolean)
          .forEach((tag) => mergedTags.add(tag));

        const url = new URL(apiUrl("/api/products"));

        const finalTags = Array.from(mergedTags);
        if (finalTags.length > 0) {
          url.searchParams.set("tags", finalTags.join(","));
        }

        if (sort) {
          url.searchParams.set("sort", sort);
        }

        if (search) {
          url.searchParams.set("search", search);
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
        onCountChange?.(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
        onCountChange?.(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialTag, tagsFromUrl, sort, search, onCountChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#7a5641]" size={32} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#dbcab9] bg-white px-6 py-20 text-center text-[#8c7361]">
        No products found for the selected filters.
      </div>
    );
  }

  return (
    <>
      {variant === "collection" ? (
        view === "list" || view === "detail" ? (
          <section className="space-y-5">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group flex gap-4 rounded-[22px] border border-[#eadfce] bg-white p-4 shadow-[0_12px_28px_rgba(115,80,60,0.06)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-[150px] w-[120px] shrink-0 overflow-hidden rounded-[16px] bg-[#f6eee4]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#b59a86]">
                      <ImageIcon size={34} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 py-1">
                  <h3 className="line-clamp-2 text-[16px] leading-6 text-[#2e221d]">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7e6554]">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-[#e73379]">
                      {currencyFormatter.format(product.price || 0)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[14px] text-[#8f7767] line-through">
                        {currencyFormatter.format(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <CollectionProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </section>
        )
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </section>
      )}

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
}
