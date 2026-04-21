"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Loader2, Plus, UploadCloud, X } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { PRODUCT_TAG_GROUPS, normalizeTag } from "@/lib/productTags";
import { useAuth } from "@/context/AuthContext";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

const parseApiResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    images: [],
    tags: [],
  });

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl(`/api/products/${id}`));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load product");
        }

        setFormData({
          name: data.name || "",
          price: data.price || "",
          description: data.description || "",
          stock: data.stock || 0,
          images: data.images || [],
          tags: data.tags || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const toggleTag = (tag) => {
    setFormData((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  };

  const addCustomTag = () => {
    const normalized = normalizeTag(customTag);
    if (!normalized) return;

    setFormData((current) => ({
      ...current,
      tags: current.tags.includes(normalized) ? current.tags : [...current.tags, normalized],
    }));
    setCustomTag("");
  };

  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploads = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      const response = await fetch(apiUrl("/api/admin/uploads/images"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify({ images: uploads }),
      });
      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Unable to upload images");
      }

      setFormData((current) => ({
        ...current,
        images: [...current.images, ...(data?.images || []).map((image) => image.url)],
      }));
    } catch (err) {
      alert(err.message || "Unable to upload images");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/products/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          description: formData.description.trim(),
          stock: Number(formData.stock),
          images: formData.images,
          tags: formData.tags,
        }),
      });
      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Unable to update product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center rounded-2xl border border-gray-100 bg-white p-10">
        <Loader2 className="animate-spin text-[#AF8F75]" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">Products</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#3f2a20]">Edit Product</h1>
        <p className="mt-2 text-sm text-[#7e6554]">Update product details, inventory, tags, and hosted image URLs.</p>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleInputChange} required />
              <Input label="Stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleInputChange} required />
            </div>
            <label>
              <span className="mb-1 block text-sm font-medium text-gray-700">Description</span>
              <textarea
                name="description"
                rows={8}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </label>

            <div className="rounded-2xl border border-gray-100 bg-[#fcfaf7] p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={customTag}
                  onChange={(event) => setCustomTag(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomTag();
                    }
                  }}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  placeholder="Add custom tag"
                />
                <button type="button" onClick={addCustomTag} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7a5641] px-4 py-3 text-sm font-medium text-white">
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {PRODUCT_TAG_GROUPS.map((group) => (
                <div key={group.key} className="rounded-2xl border border-gray-100 p-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4032]">{group.title}</h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {group.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleTag(option.value)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm ${
                          formData.tags.includes(option.value)
                            ? "border-[#7a5641] bg-[#f7efe5] text-[#7a5641]"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${formData.tags.includes(option.value) ? "border-[#7a5641] bg-[#7a5641]" : "border-gray-300"}`}>
                          {formData.tags.includes(option.value) && <Check size={12} className="text-white" />}
                        </span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-[#fcfaf7] p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4032]">Images</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {formData.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d7c5b3] bg-white text-center">
                  {uploading ? <Loader2 className="animate-spin text-[#7a5641]" size={24} /> : <UploadCloud className="text-[#a8836e]" size={24} />}
                  <span className="mt-2 text-xs font-medium text-[#7e6554]">{uploading ? "Uploading" : "Upload"}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={uploadImages} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
          <Link href="/admin/products" className="rounded-xl bg-gray-100 px-6 py-3 text-center font-medium text-gray-700">Cancel</Link>
          <button type="submit" disabled={saving} className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#3f2a20] px-6 py-3 font-medium text-white disabled:opacity-70">
            {saving ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
      />
    </label>
  );
}
