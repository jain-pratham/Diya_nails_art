"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function CreateCategoryModal({ isOpen, onClose, onCategoryCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      onCategoryCreated(data); // Pass back the new category
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Create Category</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Press On French"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
