"use client";

import { useState, KeyboardEvent } from "react";
import { FiPlus, FiX, FiCheck } from "react-icons/fi";

interface ProductColorSelectorProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

const POPULAR_COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Red", hex: "#D71920" },
  { name: "Navy Blue", hex: "#1E293B" },
  { name: "Royal Blue", hex: "#2563EB" },
  { name: "Heather Grey", hex: "#9CA3AF" },
  { name: "Charcoal", hex: "#374151" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Olive", hex: "#65A30D" },
  { name: "Golden Yellow", hex: "#EAB308" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Maroon", hex: "#881337" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Cyan", hex: "#06B6D4" },
];

export function getColorHex(colorName: string): string {
  const normalized = colorName.trim().toLowerCase();
  const found = POPULAR_COLORS.find(
    (c) => c.name.toLowerCase() === normalized
  );
  if (found) return found.hex;

  // Fallback heuristics for common names
  if (normalized.includes("black")) return "#111111";
  if (normalized.includes("white")) return "#FFFFFF";
  if (normalized.includes("red")) return "#D71920";
  if (normalized.includes("blue")) return "#2563EB";
  if (normalized.includes("green")) return "#166534";
  if (normalized.includes("grey") || normalized.includes("gray")) return "#9CA3AF";
  if (normalized.includes("yellow")) return "#EAB308";
  if (normalized.includes("orange")) return "#EA580C";
  if (normalized.includes("purple")) return "#9333EA";
  if (normalized.includes("pink")) return "#EC4899";
  if (normalized.includes("brown")) return "#78350F";
  if (normalized.includes("gold")) return "#D97706";

  return "#64748B"; // default neutral slate
}

export default function ProductColorSelector({
  colors,
  onChange,
}: ProductColorSelectorProps) {
  const [customName, setCustomName] = useState("");
  const [pickerHex, setPickerHex] = useState("#D71920");

  function toggleColor(name: string) {
    const trimmed = name.trim();
    if (colors.includes(trimmed)) {
      onChange(colors.filter((c) => c !== trimmed));
    } else {
      onChange([...colors, trimmed]);
    }
  }

  function removeColor(index: number) {
    onChange(colors.filter((_, i) => i !== index));
  }

  function handleAddCustom() {
    const trimmed = customName.trim();
    if (!trimmed) return;

    const entries = trimmed
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const newColors = [...colors];
    for (const item of entries) {
      if (!newColors.includes(item)) {
        newColors.push(item);
      }
    }

    onChange(newColors);
    setCustomName("");
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
          Available Colours
        </label>
        {colors.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-gray-500 hover:text-red-600 transition"
          >
            Clear all ({colors.length})
          </button>
        )}
      </div>

      {/* Selected Colors Tags */}
      {colors.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/80 p-2.5">
          {colors.map((color, index) => {
            const hex = getColorHex(color);
            const isLight = hex.toLowerCase() === "#ffffff" || hex.toLowerCase() === "#fff";
            return (
              <span
                key={`${color}-${index}`}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-xs"
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full shrink-0 ${
                    isLight ? "ring-1 ring-gray-300" : ""
                  }`}
                  style={{ backgroundColor: hex }}
                />
                <span>{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-neutral-400 hover:text-red-600 transition"
                  title={`Remove color ${color}`}
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-2.5 text-center text-xs text-gray-400">
          No colours selected. Pick from popular swatches below or add custom.
        </div>
      )}

      {/* Popular Colour Swatches */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2">
        <div className="text-[11px] font-semibold text-gray-500">
          Popular Sports Colours (Click to select/deselect):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_COLORS.map((item) => {
            const isSelected = colors.includes(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggleColor(item.name)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                  isSelected
                    ? "border-[#d71920] bg-red-50 text-[#d71920] shadow-xs"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full shrink-0 ${
                    item.border ? "ring-1 ring-gray-300" : ""
                  }`}
                  style={{ backgroundColor: item.hex }}
                />
                <span>{item.name}</span>
                {isSelected && <FiCheck className="h-3 w-3 text-[#d71920]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-2">
        <div
          className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-300 shadow-xs cursor-pointer"
          title="Pick color shade"
        >
          <input
            type="color"
            value={pickerHex}
            onChange={(e) => {
              setPickerHex(e.target.value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span
            className="h-full w-full rounded-md"
            style={{ backgroundColor: pickerHex }}
          />
        </div>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Custom colour name (e.g. Cobalt Blue, Camo) and press Enter"
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
    </div>
  );
}
