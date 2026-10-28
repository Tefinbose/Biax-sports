export const POPULAR_COLORS = [
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
] as const;

export function getColorHex(colorName: string): string {
  if (!colorName) return "#64748B";
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

  return "#64748B"; // default slate
}
