"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { tagDisplayName } from "@/lib/productTags";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function AdminProducts() {
  const { user } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl("/api/products"));
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      const response = await fetch(apiUrl(`/api/products/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
      });

      if (response.ok) {
        setProducts((current) => current.filter((product) => product._id !== id));
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage tag-based nail products.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-pink-500" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No products yet. Create your first nail set.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 md:hidden">
              {products.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-900">{product.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="inline-flex items-center justify-center rounded-lg bg-gray-50 p-2 text-gray-700"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                            className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-pink-50 px-3 py-1 text-[11px] font-medium text-pink-700">
                            {tagDisplayName(tag)}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock: {product.stock}</span>
                        <span className="font-semibold text-gray-900">{currencyFormatter.format(product.price || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <table className="hidden w-full text-left md:table">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Tags</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="mt-1 line-clamp-1 text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {product.tags?.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700"
                        >
                          {tagDisplayName(tag)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {currencyFormatter.format(product.price || 0)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="mr-2 inline-flex items-center justify-center rounded-lg bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product._id)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
