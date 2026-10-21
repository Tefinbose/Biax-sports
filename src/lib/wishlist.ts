export const WISHLIST_STORAGE_KEY = "biax-sports-wishlist";

export function readWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function saveWishlist(items: string[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function toggleWishlist(productId: string): boolean {
  if (typeof window === "undefined") return false;

  const current = readWishlist();
  const exists = current.includes(productId);
  const updated = exists
    ? current.filter((id) => id !== productId)
    : [...current, productId];

  saveWishlist(updated);

  window.dispatchEvent(
    new CustomEvent("biax-wishlist-updated", {
      detail: { productId, wishlisted: !exists },
    }),
  );

  return !exists;
}

export function isWishlisted(productId: string): boolean {
  if (typeof window === "undefined") return false;
  return readWishlist().includes(productId);
}
