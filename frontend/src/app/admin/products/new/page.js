"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UploadCloud, X, Check, Plus } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { PRODUCT_TAG_GROUPS, normalizeTag } from "@/lib/productTags";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

function TagGroup({ group, selectedTags, onToggle }) {
  return (
    <div className="rounded-3xl border border-[#ebe1d7] bg-white p-5 shadow-[0_12px_30px_rgba(115,80,60,0.04)]">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4032]">
        {group.title}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {group.options.map((option) => {
          const checked = selectedTags.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                checked
                  ? "border-[#7a5641] bg-[#f7efe5] text-[#7a5641]"
                  : "border-[#e7ddd3] bg-[#fffdfb] text-[#5b4032] hover:border-[#d7c5b3] hover:bg-[#faf6f1]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  checked ? "border-[#7a5641] bg-[#7a5641]" : "border-[#cdb9a6] bg-white"
                }`}
              >
                {checked && <Check size={12} className="text-white" strokeWidth={3} />}
              </span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    images: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleTag = (tag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  };

  const addCustomTag = () => {
    const normalized = normalizeTag(customTag);
    if (!normalized) return;

    setSelectedTags((current) =>
      current.includes(normalized) ? current : [...current, normalized]
    );
    setCustomTag("");
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setImageUploading(true);
    try {
      const uploads = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setFormData((current) => ({
        ...current,
        images: [...current.images, ...uploads],
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to read images.");
    } finally {
      setImageUploading(false);
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
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/products"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          description: formData.description.trim(),
          stock: Number(formData.stock),
          images: formData.images,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="rounded-[28px] border border-[#ebe1d7] bg-white p-5 sm:p-6 shadow-[0_18px_40px_rgba(115,80,60,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">Products</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-[#3f2a20]">Add New Product</h1>
        <p className="mt-2 text-sm text-[#7e6554]">
          Create a product with multiple tags and keep the admin UI clean and stable.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[28px] border border-[#ebe1d7] bg-white p-5 sm:p-6 shadow-[0_18px_40px_rgba(115,80,60,0.05)]"
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#ebe1d7] bg-[#fcfaf7] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4032]">
                Product Details
              </h2>

              <div className="mt-4 space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    placeholder="Blush French Bridal Set"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      placeholder="499"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={7}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    placeholder="Describe the set, finish, fit, and best use cases."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-[#ebe1d7] bg-[#fcfaf7] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4032]">Images</h2>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  <div
                    key={`${index}-${image.slice(0, 20)}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <label
                  className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d7c5b3] bg-white text-center transition-colors hover:border-[#7a5641] hover:bg-[#faf6f1] ${
                    imageUploading ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  {imageUploading ? (
                    <Loader2 className="animate-spin text-[#7a5641]" size={24} />
                  ) : (
                    <>
                      <UploadCloud className="text-[#a8836e]" size={24} />
                      <span className="mt-2 text-xs font-medium text-[#7e6554]">Upload</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="mt-2 text-xs text-[#8f7767]">Images are stored as simple data URLs for this setup.</p>
            </div>

            <div className="rounded-3xl border border-[#ebe1d7] bg-[#fcfaf7] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4032]">
                    Tags
                  </label>
                  <span className="text-xs text-[#8f7767]">{selectedTags.length} selected</span>
                </div>
              </div>

              <div className="mb-4 rounded-3xl border border-dashed border-[#d7c5b3] bg-white p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Add Custom Color / Tag</label>
                <div className="flex flex-col sm:flex-row gap-2">
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
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    placeholder="e.g. maroon, lavender, champagne"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7a5641] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#664937]"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  New colors or search tags will be saved as normal product tags.
                </p>
              </div>

              <div className="space-y-4">
                {PRODUCT_TAG_GROUPS.map((group) => (
                  <TagGroup key={group.key} group={group} selectedTags={selectedTags} onToggle={toggleTag} />
                ))}
              </div>

              {selectedTags.length > 0 && (
                <div className="mt-4 rounded-3xl border border-[#ebe1d7] bg-white p-4">
                  <p className="text-sm font-medium text-[#7a5641]">Generated tags array</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f7efe5] px-3 py-1 text-xs font-medium text-[#7a5641] shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-[#ebe1d7] pt-5">
          <Link
            href="/admin/products"
            className="rounded-xl bg-[#f3ece4] px-6 py-3 text-center font-medium text-[#5b4032] hover:bg-[#eadfce]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#3f2a20] px-6 py-3 font-medium text-white hover:bg-[#2e1e17] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
