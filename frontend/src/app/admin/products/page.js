"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { tagDisplayName } from "@/lib/productTags";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function AdminProducts() {
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
      });

      if (response.ok) {
        setProducts((current) => current.filter((product) => product._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage tag-based nail products.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800"
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
          <table className="w-full text-left">
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
        )}
      </div>
    </div>
  );
}
