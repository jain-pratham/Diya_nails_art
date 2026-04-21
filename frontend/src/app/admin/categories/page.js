"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Trash2, X } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const emptyForm = {
  name: "",
  description: "",
};

export default function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${user?.token || ""}`,
    }),
    [user?.token]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(apiUrl("/api/categories"));
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setError("");
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? apiUrl(`/api/categories/${editingCategory._id}`)
        : apiUrl("/api/categories");
      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to save category");
      }

      if (editingCategory) {
        setCategories((current) => current.map((category) => (category._id === data._id ? data : category)));
      } else {
        setCategories((current) => [data, ...current]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      const response = await fetch(apiUrl(`/api/categories/${id}`), {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete category");
      }

      setCategories((current) => current.filter((category) => category._id !== id));
      if (editingCategory?._id === id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Manage storefront category labels and slugs.</p>
          </div>
          {editingCategory && (
            <button type="button" onClick={resetForm} className="rounded-xl bg-gray-100 p-2 text-gray-600">
              <X size={18} />
            </button>
          )}
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
            <input
              required
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              placeholder="Wedding Nails"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Description</span>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              placeholder="Optional category description"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3f2a20] px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {editingCategory ? "Save Category" : "Create Category"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          <p className="mt-1 text-sm text-gray-500">Edit or remove categories used across the shop.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-pink-500" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No categories found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((category) => (
              <div key={category._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{category.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{category.slug}</p>
                  {category.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{category.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(category)} className="rounded-lg bg-gray-50 p-2 text-gray-700 hover:bg-gray-100">
                    <Edit3 size={16} />
                  </button>
                  <button type="button" onClick={() => deleteCategory(category._id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
