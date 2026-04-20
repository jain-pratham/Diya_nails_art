"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_TAG_GROUPS, normalizeTag, tagDisplayName } from "@/lib/productTags";

function FilterGroup({ group, selectedTags, onToggle }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-[#eadfce] py-4 last:border-none">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b4032]">
          {group.title}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#a8836e] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {group.options.map((option) => {
            const isChecked = selectedTags.includes(option.value);

            return (
              <label key={option.value} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(option.value)}
                  className="sr-only"
                />
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-[6px] border transition-colors ${
                    isChecked ? "border-[#7a5641] bg-[#7a5641]" : "border-[#cfb9a6] bg-white"
                  }`}
                >
                  {isChecked && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                <span className={`text-sm ${isChecked ? "font-medium text-[#3f2a20]" : "text-[#7e6554]"}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "border-[#7a5641] bg-[#f7efe5] text-[#3f2a20]"
          : "border-[#eadfce] bg-white text-[#7e6554] hover:border-[#cfb9a6]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`ml-3 flex h-4 w-4 items-center justify-center rounded-[4px] border ${
          active ? "border-[#7a5641] bg-[#7a5641]" : "border-[#cfb9a6] bg-transparent"
        }`}
      >
        {active && <Check size={10} strokeWidth={3} className="text-white" />}
      </span>
    </button>
  );
}

export default function FilterSidebar({ compact = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const tagsParam = searchParams.get("tags");
    const nextTags = tagsParam
      ? tagsParam.split(",").map((tag) => normalizeTag(tag)).filter(Boolean)
      : [];

    setSelectedTags([...new Set(nextTags)]);
  }, [searchParams]);

  const updateUrl = (nextTags) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTags.length > 0) {
      params.set("tags", nextTags.join(","));
    } else {
      params.delete("tags");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleToggle = (tag) => {
    const normalized = normalizeTag(tag);
    const nextTags = selectedTags.includes(normalized)
      ? selectedTags.filter((item) => item !== normalized)
      : [...selectedTags, normalized];

    setSelectedTags(nextTags);
    updateUrl(nextTags);
  };

  const clearAll = () => {
    setSelectedTags([]);
    updateUrl([]);
  };

  const typeOptions = PRODUCT_TAG_GROUPS.find((group) => group.key === "category")?.options || [];
  const lengthOptions = PRODUCT_TAG_GROUPS.find((group) => group.key === "length")?.options || [];

  return (
    <aside className={compact ? "space-y-6" : "rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_18px_40px_rgba(115,80,60,0.06)]"}>
      <div className="space-y-6">
        <section className={compact ? "rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_12px_30px_rgba(115,80,60,0.04)]" : "border-b border-[#eadfce] pb-6"}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b4032]">Availability</p>
              <h2 className="mt-1 text-[17px] font-medium text-[#3f2a20]">Filter products</h2>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className={`text-sm text-[#8d6f5a] underline-offset-4 hover:text-[#3f2a20] hover:underline ${
                selectedTags.length ? "opacity-100" : "pointer-events-none opacity-30"
              }`}
            >
              Clear
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#7e6554]">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#cfb9a6] bg-white">
                <Check size={12} strokeWidth={3} className="text-transparent" />
              </span>
              In stock
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#7e6554]">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#cfb9a6] bg-white">
                <Check size={12} strokeWidth={3} className="text-transparent" />
              </span>
              Out of stock
            </label>
          </div>
        </section>

        <section className={compact ? "rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_12px_30px_rgba(115,80,60,0.04)]" : "border-b border-[#eadfce] pb-6"}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b4032]">Price</p>
              <h3 className="mt-1 text-[17px] font-medium text-[#3f2a20]">Range</h3>
            </div>

            <span className="text-sm text-[#a8836e]">—</span>
          </div>

          <div className="mt-5">
            <div className="relative h-1.5 rounded-full bg-[#e7d8c8]">
              <div className="absolute left-0 top-0 h-1.5 w-[100%] rounded-full bg-[#2b1f1a]" />
            </div>
            <div className="mt-3 flex justify-between text-sm text-[#7e6554]">
              <span>Price: ₹ 0.00</span>
              <span>₹ 700.00</span>
            </div>
          </div>
        </section>

        <section className={compact ? "rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_12px_30px_rgba(115,80,60,0.04)]" : "border-b border-[#eadfce] pb-6"}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b4032]">Type</p>
              <h3 className="mt-1 text-[17px] font-medium text-[#3f2a20]">Collection</h3>
            </div>

            <span className="text-sm text-[#a8836e]">—</span>
          </div>

          <div className="mt-4 space-y-3">
            {typeOptions.map((option) => {
              const isChecked = selectedTags.includes(option.value);
              return (
                <FilterPill
                  key={option.value}
                  label={option.label}
                  active={isChecked}
                  onClick={() => handleToggle(option.value)}
                />
              );
            })}
          </div>
        </section>

        <section className={compact ? "rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_12px_30px_rgba(115,80,60,0.04)]" : ""}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b4032]">Length</p>
              <h3 className="mt-1 text-[17px] font-medium text-[#3f2a20]">Choose size</h3>
            </div>

            <span className="text-sm text-[#a8836e]">—</span>
          </div>

          <div className="mt-4 space-y-3">
            {lengthOptions.map((option) => {
              const isChecked = selectedTags.includes(option.value);
              return (
                <FilterPill
                  key={option.value}
                  label={option.label}
                  active={isChecked}
                  onClick={() => handleToggle(option.value)}
                />
              );
            })}
          </div>
        </section>

        {!compact && selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggle(tag)}
                className="rounded-full bg-[#f7efe5] px-3 py-1 text-xs font-medium text-[#7a5641]"
              >
                {tagDisplayName(tag)} x
              </button>
            ))}
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-6">
          {PRODUCT_TAG_GROUPS.map((group) => (
            <FilterGroup
              key={group.key}
              group={group}
              selectedTags={selectedTags}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
