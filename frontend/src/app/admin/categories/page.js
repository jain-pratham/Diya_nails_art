"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Loader2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(apiUrl("/api/categories"));
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(apiUrl(`/api/categories/${id}`), {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product categories.</p>
        </div>
        {/* We can just point to Products -> New or add a modal trigger here if we wanted. But the modal is in Product form. */}
        {/* For now just a simple page to view and delete */}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin text-pink-500" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found. Add one from the Product screen.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 md:hidden">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{cat.name}</p>
                    <p className="text-sm text-gray-500 truncate">{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

          <table className="hidden w-full text-left border-collapse md:table">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
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
