"use client";

import { useState, KeyboardEvent } from "react";
import { FiPlus, FiX, FiCheck } from "react-icons/fi";

interface ProductSizeSelectorProps {
  sizes: string[];
  onChange: (sizes: string[]) => void;
  category?: "sportswear" | "martial-arts-uniforms" | "sports-equipment";
}

const PRESET_GROUPS = [
  {
    name: "Apparel (Adult)",
    categoryHint: "sportswear",
    presets: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  },
  {
    name: "Martial Arts Uniforms (Height cm)",
    categoryHint: "martial-arts-uniforms",
    presets: [
      "110",
      "120",
      "130",
      "140",
      "150",
      "160",
      "170",
      "180",
      "190",
      "200",
    ],
  },
  {
    name: "Martial Arts Belts (000 - 7)",
    categoryHint: "martial-arts-uniforms",
    presets: ["000", "00", "0", "1", "2", "3", "4", "5", "6", "7"],
  },
  {
    name: "Numeric / Shoes / Equipment",
    categoryHint: "sports-equipment",
    presets: ["6", "7", "8", "9", "10", "11", "12"],
  },
  {
    name: "Standard",
    presets: ["One Size", "Standard", "Junior", "Senior"],
  },
];

export default function ProductSizeSelector({
  sizes,
  onChange,
  category,
}: ProductSizeSelectorProps) {
  const [customInput, setCustomInput] = useState("");
  const [activeGroupIndex, setActiveGroupIndex] = useState(() => {
    if (category === "martial-arts-uniforms") return 1;
    if (category === "sports-equipment") return 3;
    return 0;
  });

  function addSize(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!sizes.includes(trimmed)) {
      onChange([...sizes, trimmed]);
    }
  }

  function toggleSize(value: string) {
    const trimmed = value.trim();
    if (sizes.includes(trimmed)) {
      onChange(sizes.filter((s) => s !== trimmed));
    } else {
      onChange([...sizes, trimmed]);
    }
  }

  function removeSize(index: number) {
    onChange(sizes.filter((_, i) => i !== index));
  }

  function handleAddCustom() {
    if (!customInput.trim()) return;

    // Support comma or space separated batch entry
    const entries = customInput
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const newSizes = [...sizes];
    for (const item of entries) {
      if (!newSizes.includes(item)) {
        newSizes.push(item);
      }
    }

    onChange(newSizes);
    setCustomInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  }

  function handleClearAll() {
    onChange([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">
          Available Sizes
        </label>
        {sizes.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-gray-500 hover:text-red-600 transition"
          >
            Clear all ({sizes.length})
          </button>
        )}
      </div>

      {/* Selected Sizes Tags */}
      {sizes.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/80 p-2.5">
          {sizes.map((size, index) => (
            <span
              key={`${size}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-bold text-neutral-900 shadow-xs"
            >
              <span>{size}</span>
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-neutral-400 hover:text-red-600 transition"
                title={`Remove size ${size}`}
              >
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-2.5 text-center text-xs text-gray-400">
          No sizes selected. Click presets below or add a custom size.
        </div>
      )}

      {/* Custom Size Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add custom size (e.g. 4XL, 185cm) and press Enter"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-[#d71920] focus:ring-1 focus:ring-[#d71920] focus:outline-hidden"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Quick-Add Presets with Category Tabs */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2.5">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 pb-2">
          <span className="text-[11px] font-semibold text-gray-500 mr-1">
            Quick Presets:
          </span>
          {PRESET_GROUPS.map((group, idx) => {
            const isActive = activeGroupIndex === idx;
            return (
              <button
                key={group.name}
                type="button"
                onClick={() => setActiveGroupIndex(idx)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-[#d71920] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {group.name}
              </button>
            );
          })}
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_GROUPS[activeGroupIndex].presets.map((preset) => {
            const isSelected = sizes.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => toggleSize(preset)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                  isSelected
                    ? "border-[#d71920] bg-red-50 text-[#d71920] shadow-xs"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {isSelected && <FiCheck className="h-3 w-3" />}
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
